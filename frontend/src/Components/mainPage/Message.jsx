import React, { useState } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import routes from '../../routes';
import { BsPencilFill, BsTrash2Fill } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Anchorme } from 'react-anchorme'
import TextareaAutosize from 'react-textarea-autosize';

const MessageOtions = ({isMessageMine, setIsEditing, setShowModal}) => {
  return <div className={"messageOptionsHandler" + (isMessageMine ? ' leftOptions' : ' rightOptions')}>
    <BsPencilFill
      size={18}
      id='editMessageIcon'
      className='messageOption'
      onClick={() => setIsEditing(true)}
    />
    <BsTrash2Fill
      size={18}
      id='deleteMessageIcon'
      className='messageOption'
      onClick={() => setShowModal(true)}
    />
  </div>
}
const MessageRemoveModal = ({ removeMessageHandler, showModal, handleCloseModal, t, token }) => {
  const handleSubmit = async () => {
    removeMessageHandler(token);
    handleCloseModal();
  }

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

export default ({ username, body, id }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const isMessageMine = username == currentUser.name;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const lines = body.split('\n').map((line, index) => (
    <div key={index}><Anchorme target="_blank">{line}</Anchorme></div>
  ));

  const messageRemovedNotify = () => toast.success(t('messageRemoved'));
  const messageEditedNotify = () => toast.success(t('messageEdited'));
  const networkErrorNotify = () => toast.error(t('networkError'));

  var date = new Date();
  var formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const editMessageHandler = async (id, token, body) => {
    try {
      const res = await axios.patch(routes.messagePath(id), { body }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      messageEditedNotify();
      return res.data;
    } catch (error) {
      networkErrorNotify();
      throw error;
    }
  };

  const removeMessageHandler = (id) => async (token) => {
    try {
      const res = await axios.delete(routes.messagePath(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      messageRemovedNotify();
      return res.data;
    } catch (error) {
      networkErrorNotify();
      throw error;
    }
  };

  const f = useFormik({
    onSubmit: values => {
      editMessageHandler(id, currentUser.token, values.editedMessage);
      setIsEditing(false);
    },
    initialValues: {
      editedMessage: body,
    },
  });
  return (
    <div className={"d-flex justify-content-between align-items-end text-break message"
      + (isEditing ? ' editing' : '')
      + (isMessageMine ? ' fromMe' : '')}>
      {isEditing ?
        (<>
          <Form onSubmit={f.handleSubmit}>
            <Form.Group controlId="channelName">
              <Form.Label className="visually-hidden">{t('newMessage')}</Form.Label>
              <TextareaAutosize
                type="text"
                placeholder={t('editedMessage')}
                className='mb-2'
                value={f.values.editedMessage}
                onChange={f.handleChange}
                name="editedMessage"
              />
            </Form.Group>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={f.handleSubmit}
              disabled={f.values.editedMessage.length === 0}>
              {t('send')}
            </Button>
          </Form>
        </>)
        :
        (<>
          <div className="usernameBlock">
            {isMessageMine ? t('your') : username}
          </div>
          <div className='innerMessage'>
            {lines}
          </div>
          <div className='messageTime'>
            {formattedTime}
          </div>
          {isMessageMine || currentUser.name == 'admin' 
          ?
        <MessageOtions isMessageMine={isMessageMine} setIsEditing={setIsEditing} setShowModal={setShowModal}/>:''}
        </>)
      }

      {
        <MessageRemoveModal
          removeMessageHandler={removeMessageHandler(id)}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          t={t}
          token={currentUser.token}
        />
      }
    </div>
  );
};