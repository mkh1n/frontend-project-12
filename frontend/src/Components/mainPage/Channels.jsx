import { useDispatch, useSelector } from "react-redux";
import { Nav, Button, Col, Modal, Form, Dropdown } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { selectChannels, selectCurrentChannelId, setCurrentChannelId } from "../../slices/channelsSlice";
import axios from "axios";
import routes from "../../routes";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useEffect, useRef, useState } from "react";
import { selectCurrentUser } from "../../slices/authSlice";
import { selectMessages } from "../../slices/messagesSlice";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Channel = ({ name, variant, handleClick, removable, id, handleOpenModal, t }) => {
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
            <Dropdown.Item onClick={() => handleOpenModal('rename', id)}>{t('rename')}</Dropdown.Item>
            <Dropdown.Item onClick={() => handleOpenModal('remove', id)}>{t('remove')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Nav.Item>
  )
}

const ChannelModal = ({ action, showModal, handleCloseModal, channelsNames, t, token }) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const validationSchema = Yup.object().shape({
    channelName: action.name === 'remove' ? Yup.string() : Yup.string()
      .min(3, t('minChannelNameError'))
      .max(20, t('maxChannelNameError'))
      .notOneOf(channelsNames, t('uniqueChannelNameError'))
      .required(t('emptyChannelNameError')),
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

  useEffect(() => {
    setTimeout(() => {
      modalRef.current ? modalRef.current.focus() : modalRef.current;
    }, 1)
  }, []);

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{action.description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action.name == 'remove' ? (
          t('channelRemoveConfirmation'))
          : (
            <Form onSubmit={f.handleSubmit}>
              <Form.Group controlId="channelName" hasValidation>
                <Form.Label className="visually-hidden">{t('channelCreateHeader')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('emptyChannelNameError')}
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
          {t('cancel')}
        </Button>
        <Button variant={action.name === 'remove' ? "danger" : 'primary'} onClick={f.handleSubmit} disabled={loading}>
          {t(action.name === 'remove' ? 'remove' : 'send')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default () => {
  const messages = useSelector(selectMessages);
  const channels = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
  const currentChannelMessagesIds = messages.filter((m) => m.channelId == currentChennelId).map((m) => m.id)
  const currentUser = useSelector(selectCurrentUser);

  const channelCreatedNotify = () => toast.success(t('channelCreated'));
  const channelRemovedNotify = () => toast.success(t('channelRemoved'));
  const channelRenamedNotify = () => toast.success(t('channelRenamed'));
  const networkErrorNotify = () => toast.error(t('networkError'));

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleOpenModal = (name, channelId) => {
    let description;
    let handler;
    switch (name) {
      case 'rename':
        description = t('channelRenameDescription');
        handler = renameChannelHandler(channelId);
        break;
      case 'remove':
        description = t('channelRemoveDescription');
        handler = removeChannelHandler(channelId);
        break;
      case 'create':
        description = t('channelCreateDescription');
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
    t={t}
  />
  );

  const createChannelHandler = async (token, name) => {
    try{
      const res = await axios.post(routes.channelsPath(), { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      channelCreatedNotify()
      return res.data
    } catch (error) {
      networkErrorNotify();
      throw error;
    }
  };

  const renameChannelHandler = (channelId) => async (token, name) => {
    try {
      const res = await axios.patch(routes.channelPath(channelId), { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      channelRenamedNotify();
      return res.data
    } catch (error) {
      networkErrorNotify();
      throw error;
    }
  };

  const removeChannelHandler = (channelId) => async (token) => {
    try{
      await axios.delete(routes.channelPath(channelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      channelRemovedNotify()
      currentChannelMessagesIds.map(async (messageId) => {
        await axios.delete(routes.messagePath(messageId), {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      });
    } catch (error){
      networkErrorNotify();
      throw error;
    }
  };

  return (
    <Col xs={4} md={3} className="border-end px-0 bg-light d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
        <b>{t('channels')}</b>
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
          t={t}
          token={currentUser.token}
        />
      )}
    </Col>
  );
};
