/* eslint-disable react/destructuring-assignment */
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import Header from './Header';

const MainContainer = (props) => (
  <Container fluid className="h-100 p-0">
    <Header />
    {props.children}
    <ToastContainer />
  </Container>
);

export default MainContainer;
