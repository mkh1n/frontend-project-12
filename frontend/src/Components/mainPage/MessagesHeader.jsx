import { useSelector } from "react-redux";
import { selectCurrentChannelId, selectChannels, setCurrentChannelId } from "../../slices/channelsSlice";
import { selectMessages } from "../../slices/messagesSlice";

export default () => {
  const channelsList = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(selectMessages);

  const currentChennel = channelsList.find((c) => c.id == currentChennelId);
  const currentChannelMessages = messages.filter((message) => message.channelId == currentChennelId);

  return (<div className="bg-light p-3 shadow-sm small">
    <p className="m-0"><b># {currentChennel.name}</b></p>
    <span className="text-muted">{currentChannelMessages.length} сообщений</span>
  </div>)
}