import Header from './Header';
import { Container} from 'react-bootstrap';
import {ToastContainer} from 'react-toastify';

export default (props) => {
  return (
    <Container fluid className="h-100 p-0">
      <Header/>
      {props.children}
      <ToastContainer></ToastContainer>
    </Container>
  )
}