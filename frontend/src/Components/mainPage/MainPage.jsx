import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Spinner } from 'react-bootstrap';
import LeoProfanity from 'leo-profanity';
import { setChannelsList } from '../../slices/channelsSlice';
import { selectCurrentUser, logout } from '../../slices/authSlice';
import { setMessages } from '../../slices/messagesSlice';
import subscribeToSocketEvents from '../../socket';
import routes from '../../routes';
import MainContainer from '../MainContainer';
import Channels from './Channels';
import Messages from './Messages';

const fetchChannels = async (token, dispatch, navigate) => {
  try {
    const res = await axios.get(routes.channelsPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setChannelsList(res.data)); /* eslint-disable-line */  
    return res.data;
  } catch (error) {
    if (error.response) { /* eslint-disable-line */
      dispatch(logout()); /* eslint-disable-line */
      navigate('login'); /* eslint-disable-line */
    }
    throw error;
  }
};

const fetchMessages = async (token, dispatch, navigate) => {
  try {
    const res = await axios.get(routes.messagesPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setMessages(res.data)); /* eslint-disable-line */
    return res.data;
  } catch (error) {
    if (error.response) { /* eslint-disable-line */
      dispatch(logout()); /* eslint-disable-line */
      navigate('login'); /* eslint-disable-line */
    }
    throw error;
  }
};

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filter = LeoProfanity;
  filter.add(filter.getDictionary('en')); /* eslint-disable-line */
  filter.add(filter.getDictionary('ru')); /* eslint-disable-line */

  useEffect(() => { /* eslint-disable-line */
    const loadPageData = async () => {
      setLoading(true); /* eslint-disable-line */
      const userString = localStorage.getItem('user');
      if (!userString) { /* eslint-disable-line */
        navigate('login'); /* eslint-disable-line */
      } else { /* eslint-disable-line */
        try {
          await fetchChannels(currentUser.token, dispatch, navigate); /* eslint-disable-line */
          await fetchMessages(currentUser.token, dispatch, navigate); /* eslint-disable-line */
          subscribeToSocketEvents(); /* eslint-disable-line */
          setLoading(false); /* eslint-disable-line */
        } catch (error) {
          // Ошибка уже обработана в fetchChannels и fetchMessages
        }
      }
    };
    loadPageData(); /* eslint-disable-line */
  }, [currentUser, dispatch, navigate]);

  return (
    <MainContainer>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Container fluid className="h-100 overflow-hidden border-top">
          <Row className="h-100 bg-white flex-md-row">
            <Channels filter={filter} />
            <Messages filter={filter} />
          </Row>
        </Container>
      )}
    </MainContainer>
  );
};

export default MainPage;
