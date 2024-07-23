import MainContainer from "../MainContainer";
import { Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { setChannelsList } from "../../slices/channelsSlice";
import { selectCurrentUser } from "../../slices/authSlice";
import { setMessages } from "../../slices/messagesSlice";
import subscribeToSocketEvents from "../../socket";
import axios from "axios";
import routes from "../../routes";
import Channels from "./Channels";
import Messages from "./Messages";

const fetchChannels = async (token, dispatch) => {
  console.log(token)
  const res = await axios.get(routes.channelsPath(), {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  dispatch(setChannelsList(res.data))
  return res.data
};

const fetchMessages = async (token, dispatch) => {
  console.log(token)
  const res = await axios.get(routes.messagesPath(), {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  dispatch(setMessages(res.data))
  return res.data
};

export default () => {
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(async () => {
    setLoading(true)
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("login");
    } else {
      await fetchChannels(currentUser.token, dispatch);
      await fetchMessages(currentUser.token, dispatch);
      subscribeToSocketEvents();
      setLoading(false)
    }
  }, [currentUser, dispatch]);


  return (
    <MainContainer>
      {(loading) ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Container fluid className="h-100 overflow-hidden border-top">
          <Row className="h-100 bg-white flex-md-row">
            <Channels></Channels>
            <Messages></Messages>
          </Row>
        </Container>
      )}
    </MainContainer>
  );
}