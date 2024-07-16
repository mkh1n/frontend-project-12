import MainContainer from "../MainContainer";
import { Container, Row} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { setChannelsList } from "../../slices/channelsSlice";
import { selectCurrentUser } from "../../slices/authSlice";

import axios from "axios";
import routes from "../../routes";
import Channels from "./Channels";
import Messages from "./Messages";

const fetchChannels = async (token, dispatch) => {
  console.log(token)
  const res = await axios.get(routes.channelsPath(), {
    headers: {
      Authorization: `Bearer ${token}`,
    }});
  console.log(res.data);
  dispatch(setChannelsList(res.data))
  return res.data
}

export default () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect( async () => {
    const userString = localStorage.getItem("user");
    console.log(userString)
    if (!userString) {
      navigate("login");  
    } else {
      console.log(currentUser)
      await fetchChannels(currentUser.token, dispatch)
    }
  }, [currentUser, dispatch]);

  return (
      <MainContainer>
      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Channels></Channels>
          <Messages></Messages>
        </Row>
      </Container>
      </MainContainer>
    );
}