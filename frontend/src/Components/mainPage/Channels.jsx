import { useDispatch, useSelector } from "react-redux";
import { Nav, Button, Col, Modal, Form, Dropdown } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { selectChannels, selectCurrentChannelId, setCurrentChannelId } from "../../slices/channelsSlice";
import axios from "axios";
import routes from "../../routes";
import { useFormik } from "formik";
import { act, useState } from "react";
import { selectCurrentUser } from "../../slices/authSlice";

const Channel = ({ name, variant, handleClick, removable, id, handleOpenModal }) => {
  return (
    <Nav.Item className="w-100 position-relative d-flex">
      <Button
        type="button"
        className="w-100 rounded-0 text-start btn"
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

const ChannelModal = ({ action, showModal, handleCloseModal, token }) => {

  const f = useFormik({
    onSubmit: values => {
      action.name == 'remove' ? action.handler(token) : action.handler(token,values.channelName);
      handleCloseModal();
      values.channelName = '';
    },
    initialValues: {
      channelName: '',
    },
  });

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
              <Form.Group className="mb-3" controlId="channelName">
                <Form.Label className="visually-hidden">Название канала</Form.Label>
                <Form.Control type="text" placeholder="Введите название канала" value={f.values.channelName} onChange={f.handleChange} />
              </Form.Group>

            </Form>)
        }
      </Modal.Body>

      <Modal.Footer>
        {action.name === 'remove' ?
          (<>
            <Button variant="secondary" onClick={handleCloseModal}>
              Отменить
            </Button>
            <Button variant="danger" onClick={f.handleSubmit}>
              Удалить
            </Button>
          </>)
          :
          (<>
            <Button variant="secondary" onClick={handleCloseModal}>
              Отменить
            </Button>
            <Button variant="primary" onClick={f.handleSubmit}>
              Отправить
            </Button>
          </>)
        }
      </Modal.Footer>
    </Modal>
  );
};

export default () => {
  const channels = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
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
    console.log(name, res.data)
    return res.data
  };

  const renameChannelHandler = (channelId) => async (token, name) => {
    const res = await axios.patch(routes.channelPath(channelId), { name }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(name, res.data)
    return res.data
  };

  const removeChannelHandler = (channelId) => async (token) => {
    if (channelId == currentChennelId){
      dispatch(setCurrentChannelId(1))
    }
    const res = await axios.delete(routes.channelPath(channelId), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data
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
          token={currentUser.token}
          dispatch={dispatch}
        />
      )}
    </Col>
  );
};
