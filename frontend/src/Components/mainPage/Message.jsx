import React, { useState } from 'react';
import { Form, Modal, Button, Dropdown } from 'react-bootstrap';
import routes from '../../routes';
import { BsPencilFill, BsTrash2Fill } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

const MessageRemoveModal = ({ removeMessageHandler, showModal, handleCloseModal, t, token }) => {
  const handleSubmit = async () => {
    removeMessageHandler(token)
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
  var date = new Date();
  var formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const editMessageHandler = async (id, token, body) => {
    const res = await axios.patch(routes.messagePath(id), { body }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data
  };

  const removeMessageHandler = (id) => async (token) => {
    const res = await axios.delete(routes.messagePath(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data

  };
  const f = useFormik({
    onSubmit: values => {
      editMessageHandler(id, currentUser.token, values.editedMessage)
      setIsEditing(false)
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
              <Form.Control
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
            {body}
          </div>
          <div className='messageTime'>
            {formattedTime}
          </div>
          <div className={"messageOptionsHandler" + (isMessageMine ? ' leftOptions' : ' rightOptions')}>
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