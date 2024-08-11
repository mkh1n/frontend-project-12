import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import Header from './Header';

export default function (props) {
  return (
    <Container fluid className="h-100 p-0">
      <Header />
      {props.children}
      <ToastContainer />
    </Container>
  );
}
