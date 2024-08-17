/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable default-case */
import { useDispatch, useSelector } from 'react-redux';
import {
  Nav, Button, Col, Modal, Form, Dropdown,
} from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { selectCurrentUser } from '../../slices/authSlice';
import { selectMessages } from '../../slices/messagesSlice';
import { selectMobileMenuState, toggleMenu } from '../../slices/mobileMenuSlice';
import routes from '../../routes';
import {
  selectChannels, selectCurrentChannelId, setCurrentChannelId, setIsChannelCreator,
} from '../../slices/channelsSlice';

import 'react-toastify/dist/ReactToastify.css';

const Channel = ({
  name, variant, handleClick, removable, id, handleOpenModal, t, filter,
}) => (
  <Nav.Item className="w-100 position-relative d-flex">
    <Button
      type="button"
      className="w-100 rounded-0 text-start text-truncate"
      variant={variant}
      id={id}
      onClick={handleClick}
    >
      <span className="me-1">#</span>
      {filter.clean(name)}
    </Button>
    {removable && (
    <Dropdown>
      <Dropdown.Toggle as={Button} variant="link">
        <span className="visually-hidden">{t('channelManagement')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleOpenModal('rename', id)}>{t('rename')}</Dropdown.Item>
        <Dropdown.Item onClick={() => handleOpenModal('remove', id)}>{t('remove')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    )}
  </Nav.Item>
);

const ChannelModal = ({
  action, showModal, handleCloseModal, channelsNames, t, token,
}) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const validationSchema = Yup.object().shape({
    channelName: action.name === 'remove' ? Yup.string() : Yup.string()
      .min(3, t('minMaxError'))
      .max(20, t('minMaxError'))
      .notOneOf(channelsNames, t('uniqueChannelNameError'))
      .required(t('emptyChannelNameError')),
  });

  const f = useFormik({
    onSubmit: (values) => {
      setLoading(true); /* eslint-disable-line */
      // eslint-disable-next-line no-unused-expressions
      action.name === 'remove' ? action.handler(token) : action.handler(token, values.channelName); /* eslint-disable-line */
      handleCloseModal(); /* eslint-disable-line */
      values.channelName = ''; /* eslint-disable-line */
      setLoading(false); /* eslint-disable-line */
    },
    initialValues: {
      channelName: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => { /* eslint-disable-line */
    setTimeout(() => { /* eslint-disable-line */
      modalRef.current ? modalRef.current.focus() : modalRef.current; /* eslint-disable-line */
    }, 1);
  }, []);

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{action.description}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action.name === 'remove' ? (
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
                  {f.errors.channelName ? f.errors.channelName : ''}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          {t('cancel')}
        </Button>
        <Button variant={action.name === 'remove' ? 'danger' : 'primary'} onClick={f.handleSubmit} disabled={loading} type="submit">
          {t(action.name === 'remove' ? 'remove' : 'send')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Channels = ({ filter }) => {
  const messages = useSelector(selectMessages);
  const channels = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
  const currentUser = useSelector(selectCurrentUser);
  const isMenuOpen = useSelector(selectMobileMenuState);

  const channelCreatedNotify = () => toast.success(t('channelCreated'));
  const channelRemovedNotify = () => toast.success(t('channelRemoved'));
  const channelRenamedNotify = () => toast.success(t('channelRenamed'));
  const networkErrorNotify = () => toast.error(t('networkError'));

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleOpenModal = (name, channelId) => {
    let description; /* eslint-disable-line */
    let handler; /* eslint-disable-line */
    switch (name) {
      case 'rename': /* eslint-disable-line */
        description = t('channelRenameDescription'); /* eslint-disable-line */
        handler = renameChannelHandler(channelId); /* eslint-disable-line */
        break;
      case 'remove': /* eslint-disable-line */
        description = t('channelRemoveDescription'); /* eslint-disable-line */
        handler = removeChannelHandler(channelId); /* eslint-disable-line */
        break;
      case 'create': /* eslint-disable-line */
        description = t('channelCreateDescription'); /* eslint-disable-line */
        handler = createChannelHandler; /* eslint-disable-line */
        break;
    }
    setModalAction({ /* eslint-disable-line */
      name,
      description,
      handler,
    });
    setShowModal(true); /* eslint-disable-line */
  };

  const handleCloseModal = () => {
    setShowModal(false); /* eslint-disable-line */
    setModalAction(null); /* eslint-disable-line */
  };

  const handleChangeChannel = (id) => () => {
    dispatch(setCurrentChannelId(+id)); /* eslint-disable-line */
    dispatch(toggleMenu()); /* eslint-disable-line */
  };

  const channelList = channels.map((channel) => (
    <Channel
      key={channel.id}
      name={channel.name}
      variant={+currentChennelId === +channel.id ? 'secondary' : ''}
      handleClick={handleChangeChannel(channel.id)}
      removable={channel.removable}
      id={channel.id}
      handleOpenModal={handleOpenModal}
      t={t}
      filter={filter}
    />
  ));

  const createChannelHandler = async (token, name) => {
    dispatch(setIsChannelCreator(true));/* eslint-disable-line */
    try {
      const res = await axios.post(routes.channelsPath(), { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      channelCreatedNotify(); /* eslint-disable-line */
      return res.data;
    } catch (error) {
      networkErrorNotify(); /* eslint-disable-line */
      throw error;
    }
  };

  const renameChannelHandler = (channelId) => async (token, name) => {
    dispatch(setIsChannelCreator(true));/* eslint-disable-line */
    try {
      const res = await axios.patch(routes.channelPath(channelId), { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      channelRenamedNotify(); /* eslint-disable-line */
      console.log(isChannelCreator)/* eslint-disable-line */

      return res.data;
    } catch (error) {
      networkErrorNotify(); /* eslint-disable-line */
      throw error;
    }
  };

  const removeChannelHandler = (channelId) => async (token) => {
    try {
      await axios.delete(routes.channelPath(channelId), { /* eslint-disable-line */
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const thisChannelMessagesIds = messages
        .filter((m) => +m.channelId === +channelId).map((m) => m.id);
      thisChannelMessagesIds.map(async (messageId) => { /* eslint-disable-line */
        await axios.delete(routes.messagePath(messageId), { /* eslint-disable-line */
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });
      channelRemovedNotify(); /* eslint-disable-line */
    } catch (error) {
      networkErrorNotify(); /* eslint-disable-line */
      throw error;
    }
  };

  return (
    <Col
      xs={4}
      md={3}
      className={`border-end px-0 bg-light d-flex flex-column h-100${isMenuOpen ? ' open' : ''}`}
      id="channelsHolder"
    >
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
        <b>{t('channels')}</b>
        <Button type="button" className="p-0 text-primary btn-group-vertical" variant="outline-primary" onClick={() => handleOpenModal('create')}>
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
          channelsNames={channels.map(((c) => c.name))}
          t={t}
          token={currentUser.token}
        />
      )}
    </Col>
  );
};

export default Channels;
