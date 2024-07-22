import { useDispatch, useSelector } from "react-redux"
import { Nav, Button, Col } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import { selectChannels, selectCurrentChannelId, setCurrentChannelId } from "../../slices/channelsSlice";

const RemovableChennel = ({name, variant, id, handleClick}) => {
  return (
    <Nav.Item className="w-100">
      <Button 
      type="button" 
      className="w-100 rounded-0 text-start btn" 
      variant={variant}
      id={id}
      onClick={handleClick}
      >      
        <span className="me-1">#</span>{name}
      </Button>
      галка
    </Nav.Item>
  )
}
const PersistentChennel = ({name, variant, id, handleClick}) => {
  return (
    <Nav.Item className="w-100">
      <Button
      type="button"
      className="w-100 rounded-0 text-start btn"
      variant={variant}
      id={id}
      onClick={handleClick}
      >  
        <span className="me-1">#</span>{name}
      </Button>
    </Nav.Item>
  )
}
export default () => {
  const channels = useSelector(selectChannels);
  const currentChennelID = useSelector(selectCurrentChannelId);

  const dispatch = useDispatch();

  const handleClick = (id) => () => {
    console.log(id);
    dispatch(setCurrentChannelId(+id));
  };

  const channelList = channels.map((channel) => {
    console.log(channel.id, currentChennelID, 'variant= ', currentChennelID==channel.id)
    if (channel.removable) {
      return <RemovableChennel 
        key={channel.id}
        name={channel.name}
        variant={currentChennelID == channel.id ? 'secondary': ''}
        handleClick={handleClick(channel.id)}>
      </RemovableChennel>
    } else {
      return <PersistentChennel
        key={channel.id}
        name={channel.name}
        variant={currentChennelID == channel.id ? 'secondary': ''}
        handleClick={handleClick(channel.id)}>
      </PersistentChennel>
    }
  });
  console.log(useSelector(selectCurrentChannelId))
  return (<Col xs={4} md={2} className="border-end px-0 bg-light d-flex flex-column h-100">
    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
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