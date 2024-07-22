import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectMessages } from "../../slices/messagesSlice";
import { selectCurrentChannelId } from "../../slices/channelsSlice";


export default () => {
  const messages = useSelector(selectMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  console.log(messages)
  const messagesList = messages
    .filter((m) => m.channelId == currentChannelId)
    .map((message) =>
      <Message
        username={message.username}
        body={message.body}
        id={message.id}
        key={message.id}>
      </Message>)

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader></MessagesHeader>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messagesList}
        </div>
        <div className="mt-auto px-5 py-3">
          <MessagesForm></MessagesForm>
        </div>
      </div>
    </Col>
  )
}