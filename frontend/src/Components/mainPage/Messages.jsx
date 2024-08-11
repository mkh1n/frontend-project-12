/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { BsArrowDownShort } from 'react-icons/bs';
import { Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import Message from './Message';
import MessagesForm from './MessagesForm';
import MessagesHeader from './MessagesHeader';
import { selectMessages } from '../../slices/messagesSlice';
import { selectCurrentChannelId } from '../../slices/channelsSlice';

const Messages = ({ filter }) => {
  const messages = useSelector(selectMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const container = useRef(null);
  const bottomRef = useRef(null);
  const scrollBottomRef = useRef(null);

  const currentChannelMessages = messages.filter((m) => m.channelId === currentChannelId);

  const Scroll = () => {
    const { scrollTop } = container.current;
    if (scrollTop >= -200) {
      container.current?.scrollTo(0, 0);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const { scrollTop } = container.current;
    if (scrollTop >= -200) {
      scrollBottomRef.current.style.display = 'none';
    } else {
      scrollBottomRef.current.style.display = 'flex';
    }
  };
  useEffect(() => {
    Scroll();
  }, [currentChannelMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [currentChannelId]);

  const messagesList = currentChannelMessages.map((message) => (
    <Message
      username={message.username}
      body={message.body}
      id={message.id}
      key={message.id}
      filter={filter}
    />
  ));
  messagesList.reverse();

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader filter={filter} />
        <div id="messages-box" className="chat-messages overflow-auto h-100 messagesPadding" ref={container} onScroll={handleScroll}>
          {messagesList}
          <div
            ref={bottomRef}
            style={{ position: 'absolute' }}
          />
          <Button
            variant="secondary"
            className="rounded-5 btn-floating btn-lg"
            id="scrollDownButton"
            ref={scrollBottomRef}
            onClick={scrollToBottom}
          >
            <BsArrowDownShort />
          </Button>
        </div>
        <MessagesForm />
      </div>
    </Col>
  );
};

export default Messages;
