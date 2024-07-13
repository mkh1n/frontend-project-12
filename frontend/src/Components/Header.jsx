import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#home">Hexlet Chat</Navbar.Brand>
      </Container>
    </Navbar>
  )
}