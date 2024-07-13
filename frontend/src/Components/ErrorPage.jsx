import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from "./Header";

export default () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Header></Header>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h1 style={{ color: 'blue', fontSize: '10em' }}>404</h1>
            <p style={{ color: 'gray', fontSize: '1.5em' }}>Страница не найдена</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
