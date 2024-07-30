import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainContainer from './MainContainer';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t, i18n } = useTranslation();
  return (
    <MainContainer>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <div style={{ textAlign: 'center', marginTop: '20vh' }}>
            <h1 className="text-primary fs-1 text">404</h1>
            <p className='text-muted fs-4 text'>{t('isNotFound')}</p>
          </div>
        </Col>
      </Row>
    </MainContainer>
  )
}
