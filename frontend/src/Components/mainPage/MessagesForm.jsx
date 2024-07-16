import {BsSend } from 'react-icons/bs';
import { Form } from 'react-bootstrap';
import {Button} from 'react-bootstrap'

export default () => {
  return (<Form noValidate className="py-1 border rounded-2">
    <Form.Control
      name="body"
      aria-label="Новое сообщение"
      placeholder="Введите сообщение..."
      className="border-0 p-0 ps-2"
      value=""
    />
    <Button type="submit" className="btn btn-group-vertical" disabled>
      <BsSend size={20} />
      <span className="visually-hidden">Отправить</span>
    </Button>
  </Form>)
}