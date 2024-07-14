import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from "./Header";
import MainContainer from './MainContainer';

export default () => {
  return (
    <MainContainer>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h1 className="text-primary fs-1 text">404</h1>
            <p className='text-muted fs-4 text'>Страница не найдена</p>
          </div>
        </Col>
      </Row>
    </MainContainer>
  )
}
