/* eslint-disable no-param-reassign */
import { BsSend } from 'react-icons/bs';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import Picker from 'emoji-picker-react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import routes from '../../routes';
import { selectCurrentChannelId } from '../../slices/channelsSlice';
import { selectCurrentUser } from '../../slices/authSlice';

const postMessage = async (token, newMessage) => {
  const res = await axios.post(routes.messagesPath(), newMessage, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const MessageForm = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const bodyEl = document.body;
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef(null);
  const [isMobileKeyboard, setIsMobileKeyboard] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // eslint-disable-next-line consistent-return
  useEffect(() => { /* eslint-disable-line */
    if ('virtualKeyboard' in navigator) {
      navigator.virtualKeyboard.overlaysContent = true; /* eslint-disable-line */

      const updateKeyboardHeight = () => {
        const { height } = navigator.virtualKeyboard.boundingRect;
        setKeyboardHeight(height); /* eslint-disable-line */
        setIsMobileKeyboard(height !== 0); /* eslint-disable-line */
      };

      navigator.virtualKeyboard.addEventListener('geometrychange', updateKeyboardHeight); /* eslint-disable-line */

      return () => {
        navigator.virtualKeyboard.removeEventListener('geometrychange', updateKeyboardHeight); /* eslint-disable-line */
      };
    }
  }, []);

  useEffect(() => { /* eslint-disable-line */
    const updateBodyHeight = () => {
      const maxHeight = window.innerHeight;
      bodyEl.style.height = `${maxHeight - keyboardHeight}px`; /* eslint-disable-line */
    };

    updateBodyHeight(); /* eslint-disable-line */

    window.addEventListener('resize', updateBodyHeight); /* eslint-disable-line */
    return () => {
      window.removeEventListener('resize', updateBodyHeight); /* eslint-disable-line */
    };
  }, [bodyEl.style, keyboardHeight]);

  const f = useFormik({
    onSubmit: (values) => {
      if (values.messageText === '') { /* empty */ } else { /* eslint-disable-line */
        setIsSending(true); /* eslint-disable-line */
        const newMessage = {
          body: values.messageText,
          channelId: currentChannelId,
          username: currentUser.name,
        };
        values.messageText = ''; /* eslint-disable-line */
        postMessage(currentUser.token, newMessage).then(() => { /* eslint-disable-line */
          setIsSending(false); /* eslint-disable-line */
          formRef.current.focus(); /* eslint-disable-line */
        });
      }
    },
    initialValues: {
      messageText: '',
    },
  });

  useEffect(() => { /* eslint-disable-line */
    if (!isSending) { /* eslint-disable-line */
      formRef.current?.focus(); /* eslint-disable-line */
    }
  }, [isSending]);

  useEffect(() => { /* eslint-disable-line */
    const handleClickOutside = (event) => {
      if (!event.target.closest('#emojiButton') && !event.target.closest('.EmojiPickerReact')) { /* eslint-disable-line */
        setEmojiPickerOpen(false); /* eslint-disable-line */
      }
    };

    document.addEventListener('click', handleClickOutside); /* eslint-disable-line */
    return () => {
      document.removeEventListener('click', handleClickOutside); /* eslint-disable-line */
    };
  }, []);

  const handleChange = (event) => {
    if (!isSending) { /* eslint-disable-line */
      const { value } = event.target;
      const updatedValue = value.replace(/^\s+/, '');
      f.setFieldValue('messageText', updatedValue); /* eslint-disable-line */
    } else { /* eslint-disable-line */
      f.setFieldValue(''); /* eslint-disable-line */
    }
  };

  const addNewLine = () => {
    if (f.values.messageText !== '') { /* eslint-disable-line */
      f.setFieldValue('messageText', `${f.values.messageText}\n`); /* eslint-disable-line */
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); /* eslint-disable-line */
    f.handleSubmit(e); /* eslint-disable-line */
  };

  // eslint-disable-next-line consistent-return
  const onKeyDown = (event) => {
    if (event.shiftKey && event.key === 'Enter') { /* eslint-disable-line */
      event.preventDefault(); /* eslint-disable-line */
      addNewLine(); /* eslint-disable-line */
    } else if (event.key === 'Enter') {
      event.preventDefault(); /* eslint-disable-line */
      return isMobileKeyboard ? addNewLine() : handleSubmit(event);
    }
  };

  return (
    <div className="mt-auto pb-3 messagesPadding" id="sendInputHolder">
      <Form id="sendForm" className="py-1 border rounded-5">
        <div className="emojiHolder">
          <svg
            id="emojiButton"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-emoji-smile"
            viewBox="0 0 16 16"
            onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
          </svg>
          {isEmojiPickerOpen && (
            <Picker
              id="emojiPicker"
              onEmojiClick={(emojiObject) => {
                f.setFieldValue('messageText', f.values.messageText + emojiObject.emoji); /* eslint-disable-line */
              }}
            />
          )}
        </div>
        <TextareaAutosize
          name="messageText"
          aria-label={t('newMessage')}
          placeholder={t('enterMessage')}
          className="border-0 rounded-5 p-0 ps-2"
          id="sendInput"
          style={{ resize: 'none' }}
          rows={1}
          onKeyDown={onKeyDown}
          value={isSending ? '' : f.values.messageText}
          ref={formRef}
          onChange={handleChange}
        />
        <Button
          id="sendButton"
          className="btn btn-group-vertical"
          onMouseDown={handleSubmit}
          disabled={f.values.messageText.length === 0}
        >
          <BsSend size={20} id="sendLogo" />
          <span className="visually-hidden">{t('send')}</span>
        </Button>
      </Form>
    </div>
  );
};

export default MessageForm;
