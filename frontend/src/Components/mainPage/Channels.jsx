import { useDispatch, useSelector } from "react-redux";
import { Nav, Button, Col, Modal, Form, Dropdown } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { selectChannels, selectCurrentChannelId, setCurrentChannelId} from "../../slices/channelsSlice";
import axios from "axios";
import routes from "../../routes";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useEffect, useRef, useState } from "react";
import { selectCurrentUser } from "../../slices/authSlice";
import { selectMessages } from "../../slices/messagesSlice";

const Channel = ({ name, variant, handleClick, removable, id, handleOpenModal }) => {
  return (
    <Nav.Item className="w-100 position-relative d-flex">
      <Button
        type="button"
        className="w-100 text-start btn channelName"
        variant={variant}
        id={id}
        onClick={handleClick}
      >
        <span className="me-1">#</span>{name}
      </Button>
      {removable && (
        <Dropdown>
          <Dropdown.Toggle as={Button} variant="link" >
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleOpenModal('rename', id)}>Переименовать</Dropdown.Item>
            <Dropdown.Item onClick={() => handleOpenModal('remove', id)}>Удалить</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Nav.Item>
  )
}

const ChannelModal = ({ action, showModal, handleCloseModal, channelsNames, token }) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  console.log(channelsNames)
  const validationSchema = Yup.object().shape({
    channelName: action.name === 'remove' ? Yup.string() : Yup.string()
      .min(3, 'Название должно содержать не менее 3 символов')
      .max(20, 'Название должно содержать не более 20 символов')
      .notOneOf(channelsNames, 'Название должно быть уникальным')
      .required('Название не может быть пустым'),
  });

  const f = useFormik({
    onSubmit: values => {
      setLoading(true);
      console.log(action.name == 'remove' ? action.handler(token) : action.handler(token, values.channelName))
      handleCloseModal();
      values.channelName = '';
      setLoading(false);

    },
    initialValues: {
      channelName: '',
    },
    validationSchema
  });

  useEffect(()=>{
    setTimeout(() => {
      modalRef.current ? modalRef.current.focus() : modalRef.current;
    }, 1)
  },[]);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{action.description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action.name == 'remove' ? (
          <p>Вы уверены, что хотите удалить этот канал?</p>)
          : (
            <Form onSubmit={f.handleSubmit}>
              <Form.Group controlId="channelName" hasValidation>
                <Form.Label className="visually-hidden">Название канала</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Введите название канала"
                  value={f.values.channelName}
                  onChange={f.handleChange}
                  ref={modalRef}
                  isInvalid={!!f.errors.channelName}
                  />
                <Form.Control.Feedback type="invalid">
                {f.errors.channelName ? f.errors.channelName : ""}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>)
        }
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Отменить
        </Button>
        <Button variant={action.name === 'remove' ? "danger" : 'primary'} onClick={f.handleSubmit} disabled={loading}>
          {action.name === 'remove' ? "Удалить" : "Отправить"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default () => {
  const messages = useSelector(selectMessages);
  const channels = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
  const currentChannelMessagesIds = messages.filter((m)=>m.channelId == currentChennelId).map((m)=>m.id)
  const currentUser = useSelector(selectCurrentUser);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const dispatch = useDispatch();

  const handleOpenModal = (name, channelId) => {
    let description;
    let handler;
    switch (name) {
      case 'rename':
        description = 'Переименование канала';
        handler = renameChannelHandler(channelId);
        break;
      case 'remove':
        description = 'Удаление канала';
        handler = removeChannelHandler(channelId);
        break;
      case 'create':
        description = 'Создание канала';
        handler = createChannelHandler;
        break;
    }
    setModalAction({
      name,
      description,
      handler,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAction(null);
  };


  const handleClick = (id) => () => {
    dispatch(setCurrentChannelId(+id));
  };

  const channelList = channels.map((channel) => <Channel
    key={channel.id}
    name={channel.name}
    variant={currentChennelId == channel.id ? 'secondary' : ''}
    handleClick={handleClick(channel.id)}
    removable={channel.removable}
    id={channel.id}
    handleOpenModal={handleOpenModal}
  />
  );

  const createChannelHandler = async (token, name) => {
    const res = await axios.post(routes.channelsPath(), { name }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    dispatch(setCurrentChannelId(res.data.id));
    return res.data
  };

  const renameChannelHandler = (channelId) => async (token, name) => {
    const res = await axios.patch(routes.channelPath(channelId), { name }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data
  };

  const removeChannelHandler = (channelId) => async (token) => {
    const res = await axios.delete(routes.channelPath(channelId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    currentChannelMessagesIds.map(async (messageId)=>{
      console.log(messageId)
      await axios.delete(routes.messagePath(messageId), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    });
  };

  return (
    <Col xs={4} md={2} className="border-end px-0 bg-light d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
        <b>Каналы</b>
        <Button type="button" className="p-0 text-primary" variant="btn-group-vertical" onClick={() => handleOpenModal('create')}>
          <BsPlus size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block" id="channels-box">
        {channelList}
      </Nav>
      {modalAction && (
        <ChannelModal
          action={modalAction}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          channelsNames={channels.map((c => c.name))}
          token={currentUser.token}
        />
      )}
    </Col>
  );
};
