import { useSelector } from "react-redux";
import { selectCurrentChannelId, selectChannels } from "../../slices/channelsSlice";

export default () => {
  const channelsList = useSelector(selectChannels);
  const currentChennelId = useSelector(selectCurrentChannelId);

  const currentChennel = channelsList[currentChennelId]
  console.log(currentChennel)

  return (<div className="bg-light mb-4 p-3 shadow-sm small">
    <p className="m-0"><b># {'channel'}</b></p>
    <span className="text-muted">0 сообщений</span>
  </div>)
}