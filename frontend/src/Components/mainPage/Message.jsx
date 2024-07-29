import React, { useState } from 'react';
import { Form, Modal, Button, Dropdown } from 'react-bootstrap';
import routes from '../../routes';
import { BsPencilFill, BsTrash2Fill } from 'react-icons/bs';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useFormik } from 'formik';


const MessageRemoveModal = ({ removeMessageHandler, showModal, handleCloseModal, token }) => {
  const handleSubmit = async () => {
    removeMessageHandler(token)
    handleCloseModal();
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить сообщение</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы действительно хотите <b>удалить</b> сообщение?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Отменить
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ({ username, body, id }) => {
  const currentUser = useSelector(selectCurrentUser);
  const isMessageMine = username == currentUser.name;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  var date = new Date();
  var formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const dispatch = useDispatch();

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

  console.log(isMessageMine)
  return (
    <div className={"d-flex justify-content-between align-items-end text-break message"
      + (isEditing ? ' editing' : '')
      + (isMessageMine ? ' fromMe' : '')}>
      {isEditing ?
        (<>
          <Form onSubmit={f.handleSubmit}>
            <Form.Group controlId="channelName">
              <Form.Label className="visually-hidden">Новое сообщение</Form.Label>
              <Form.Control
                type="text"
                placeholder="Измененное сообщние"
                value={f.values.editedMessage}
                onChange={f.handleChange}
                name="editedMessage"
              />
            </Form.Group>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Отменить
            </Button>
            <Button 
              variant="primary" 
              onClick={f.handleSubmit}
              disabled={f.values.editedMessage.length === 0}>
              Отправить
            </Button>
          </Form>
        </>)
        :
        (<>
          <div className="usernameBlock">
            {isMessageMine ? 'Ваше' : username}
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
          token={currentUser.token}
          dispatch={dispatch}
        />
      }
    </div>
  );
};