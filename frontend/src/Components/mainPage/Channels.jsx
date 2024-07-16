import { useSelector } from "react-redux"
import { Nav, Button, Col } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { selectChannels, selectCurrentChannelId } from "../../slices/channelsSlice";

const RemovableChennel = ({name, variant}) => {
  return (
    <Nav.Item className="w-100">
      <Button type="button" className="w-100 rounded-0 text-start btn" variant={variant}>
        <span className="me-1">#</span>{name}
      </Button>
      галка
    </Nav.Item>
  )
}
const PersistentChennel = ({name, variant}) => {
  return (
    <Nav.Item className="w-100">
      <Button type="button" className="w-100 rounded-0 text-start btn" variant={variant}>
        <span className="me-1">#</span>{name}
      </Button>
    </Nav.Item>
  )
}
export default () => {
  const channels = useSelector(selectChannels);
  const currentChennelID = useSelector(selectCurrentChannelId);

  const channelList = channels.map((channel) => {
    if (channel.removable) {
      return <RemovableChennel key={channel.id} name={channel.name} variant={currentChennelID == channel.id}></RemovableChennel>
    } else {
      return <PersistentChennel key={channel.id} name={channel.name} variant={currentChennelID == channel.id}></PersistentChennel>
    }
  });
  console.log(channelList)
  return (<Col xs={4} md={2} className="border-end px-0 bg-light d-flex flex-column h-100">
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
      <b>Каналы</b>
      <Button type="button" className="p-0 text-primary" variant="btn-group-vertical">
        <BsPlus size={20} />
        <span className="visually-hidden">+</span>
      </Button>
    </div>
    <Nav className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block" id="channels-box">
      {channelList}
    </Nav>
  </Col>)
}