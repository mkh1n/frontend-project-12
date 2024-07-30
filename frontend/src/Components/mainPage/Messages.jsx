import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { selectMessages } from "../../slices/messagesSlice";
import { selectCurrentChannelId } from "../../slices/channelsSlice";

export default () => {
  const messages = useSelector(selectMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, []);

  const currentChannelMessages = messages
  .filter((m) => m.channelId == currentChannelId);
  console.log(currentChannelMessages);
  
  const messagesList = currentChannelMessages
    .map((message) =>{
      return <Message
      username={message.username}
      body={message.body}
      id={message.id}
      key={message.id}>
    </Message>
    }
      );

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader></MessagesHeader>
        <div id="messages-box"  className="chat-messages overflow-auto h-100">
          {messagesList}
          <div ref={bottomRef}></div>
        </div>
        <div className="mt-auto px-5 pb-3">
          <MessagesForm></MessagesForm>
        </div>
      </div>
    </Col>
  )
}