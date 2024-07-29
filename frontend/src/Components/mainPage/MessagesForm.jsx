import { BsSend } from 'react-icons/bs';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { selectCurrentChannelId } from '../../slices/channelsSlice';
import Picker from "emoji-picker-react";
import { useFormik } from 'formik';

import axios from 'axios';
import routes from '../../routes';
import { useState, useEffect } from 'react';

const postMessage = async (token, newMessage) => {
  const res = await axios.post(routes.messagesPath(), newMessage, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data
};

export default () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  
  const f = useFormik({
    onSubmit: values => {
      const newMessage = {
        body: values.messageText,
        channelId: currentChannelId,
        username: currentUser.name,
      }
      values.messageText = ''
      postMessage(currentUser.token, newMessage)
    },
    initialValues: {
      messageText: "",
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#emojiButton') && !event.target.closest('.EmojiPickerReact')) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Form onSubmit={f.handleSubmit} id="sendForm" className="py-1 border rounded-2">
      <div className='emojiHolder'>
        <svg
          id="emojiButton"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-emoji-smile"
          viewBox="0 0 16 16"
          onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}>
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
        </svg>
        {isEmojiPickerOpen && (
          <Picker
            id="emojiPicker"
            onEmojiClick={(emojiObject, e) => {
              f.setFieldValue('messageText', f.values.messageText + emojiObject.emoji);
            }}
          />
        )}
      </div>
      <Form.Control
        name="messageText"
        aria-label="Новое сообщение"
        placeholder="Введите сообщение..."
        className="border-0 p-0 ps-2"
        id="sendInput"
        required
        value={f.values.messageText}
        onBlur={f.handleBlur}
        onChange={f.handleChange}
      />
      <Button
        id="sendButton"
        type="submit"
        className="btn btn-group-vertical"
        disabled={f.values.messageText.length === 0}
      >
        <BsSend size={20} id="sendLogo" />
        <span className="visually-hidden">Отправить</span>
      </Button>
    </Form>
  );
}
