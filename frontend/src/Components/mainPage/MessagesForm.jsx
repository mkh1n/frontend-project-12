import { BsSend } from 'react-icons/bs';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { selectCurrentChannelId } from '../../slices/channelsSlice';
import { useFormik } from 'formik';

import axios from 'axios';
import routes from '../../routes';
import { useState } from 'react';

const postMessage = async (token, newMessage) => {
  const res = await axios.post(routes.messagesPath(), newMessage, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data
};
const editMessageHandler = (token, id) => {

}
export default () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentChannelId = useSelector(selectCurrentChannelId);
  // const [isEditing, setIsEditing] = useState(false)
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

  return (<Form onSubmit={f.handleSubmit} id="sendForm" className="py-1 border rounded-2">
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
  </Form>)
}