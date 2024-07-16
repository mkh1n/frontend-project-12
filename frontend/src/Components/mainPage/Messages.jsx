import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import { Col } from "react-bootstrap";

export default () => {
  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader></MessagesHeader>
        <div id="messages-box" className="chat-messages overflow-auto px-5 "></div>
        <div className="mt-auto px-5 py-3">
          <MessagesForm></MessagesForm>
        </div>
      </div>
    </Col>
  )
}