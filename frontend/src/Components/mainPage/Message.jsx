import React, { useState } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { BsPencilFill, BsTrash2Fill } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Anchorme } from 'react-anchorme';
import TextareaAutosize from 'react-textarea-autosize';
import { selectCurrentUser } from '../../slices/authSlice';
import routes from '../../routes';

const MessageOtions = ({ isMessageMine, setIsEditing, setShowModal }) => (
  <div className={`messageOptionsHandler${isMessageMine ? ' leftOptions' : ' rightOptions'}`}>
    <BsPencilFill
      size={18}
      id="editMessageIcon"
      className="messageOption"
      onClick={() => setIsEditing(true)}
    />
    <BsTrash2Fill
      size={18}
      id="deleteMessageIcon"
      className="messageOption"
      onClick={() => setShowModal(true)}
    />
  </div>
);
const MessageRemoveModal = ({
  removeMessageHandler, showModal, handleCloseModal, t, token,
}) => {
  const handleSubmit = async () => {
    removeMessageHandler(token); /* eslint-disable-line */
    handleCloseModal(); /* eslint-disable-line */
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeMessage')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('messageRemoveConfirmation')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          {t('cancel')}
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          {t('remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Message = ({
  username, body, id, filter,
}) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const isMessageMine = username === currentUser.name;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  console.log(id, body)/* eslint-disable-line */
  const lines = body.split('\n').map((line, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={index}><Anchorme target="_blank">{filter.clean(line)}</Anchorme></div>
  ));

  const messageRemovedNotify = () => toast.success(t('messageRemoved'));
  const messageEditedNotify = () => toast.success(t('messageEdited'));
  const networkErrorNotify = () => toast.error(t('networkError'));

  const handleCloseModal = () => {
    setShowModal(false); /* eslint-disable-line */
  };

  const editMessageHandler = async (messageId, token, messageBody) => {
    try {
      const res = await axios.patch(routes.messagePath(messageId), { body: messageBody }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)/* eslint-disable-line */
      messageEditedNotify(); /* eslint-disable-line */
      return res.data;
    } catch (error) {
      networkErrorNotify(); /* eslint-disable-line */
      throw error;
    }
  };

  const removeMessageHandler = (messageId) => async (token) => {
    try {
      const res = await axios.delete(routes.messagePath(messageId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      messageRemovedNotify(); /* eslint-disable-line */
      return res.data;
    } catch (error) {
      networkErrorNotify(); /* eslint-disable-line */
      throw error;
    }
  };

  const f = useFormik({
    onSubmit: (values) => {
      editMessageHandler(id, currentUser.token, values.editedMessage); /* eslint-disable-line */
      setIsEditing(false); /* eslint-disable-line */
    },
    initialValues: {
      editedMessage: body,
    },
  });
  return (
    <div className={`d-flex justify-content-between align-items-end text-break message${
      isEditing ? ' editing' : ''
    }${isMessageMine ? ' fromMe' : ''}`}
    >
      {isEditing
        ? (
          <Form onSubmit={f.handleSubmit}>
            <Form.Group controlId="channelName">
              <Form.Label className="visually-hidden">{t('newMessage')}</Form.Label>
              <TextareaAutosize
                type="text"
                placeholder={t('editedMessage')}
                className="mb-2"
                value={f.values.editedMessage}
                onChange={f.handleChange}
                name="editedMessage"
                style={{ resize: 'none', borderRadius: '10px', border: 'none' }}
              />
            </Form.Group>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={f.handleSubmit}
              disabled={f.values.editedMessage.length === 0}
            >
              {t('send')}
            </Button>
          </Form>
        )
        : (
          <>
            <div className="usernameBlock">
              {isMessageMine ? t('your') : username}
            </div>
            <div className="innerMessage">
              {lines}
            </div>
            {isMessageMine || currentUser.name === 'admin'
              ? <MessageOtions isMessageMine={isMessageMine} setIsEditing={setIsEditing} setShowModal={setShowModal} /> : ''}
          </>
        )}

      <MessageRemoveModal
        removeMessageHandler={removeMessageHandler(id)}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        t={t}
        token={currentUser.token}
      />
    </div>
  );
};

export default Message;
