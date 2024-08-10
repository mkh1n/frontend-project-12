import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import MainContainer from './MainContainer';
import routes from '../routes';
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { login } from '../slices/authSlice';
import { useTranslation } from 'react-i18next';

const sendAuthRequest = async (dispatch, loginValues) => {
  const res = await axios.post(routes.loginPath(), loginValues);
  const { token, username } = res.data;
  dispatch(login({ name: username, token }))
} 
export default () => {
  const { t } = useTranslation();

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const f = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      try {
        await sendAuthRequest(dispatch, values)
        navigate("/");
      } catch (err) {
        f.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setError(t('internalLoginError'));
        } else {
          throw err;
        }
      }
    },
  });

  return (
    <MainContainer>
      <Row className="justify-content-center align-content-center h-100 w-100" id="mobileContainer">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className='row p-5'>
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src="https://www.ukpropertyaccountants.co.uk/wp-content/uploads/2023/06/10312222_18208786-min-scaled.jpg" alt={t('login')} className="rounded-circle mb-4" style={{ width: "300px" }} />
              </Col>
              <Col xs={12} md={6}>
                <Form onSubmit={f.handleSubmit}>
                  <h1 className="text-center mb-4">{t('login')}</h1>
                  <Form.Group controlId="username" className="form-floating mb-3">
                    <Form.Control type="text" placeholder={t('yourUsername')} required value={f.values.username} onChange={f.handleChange} isInvalid={error !== ''} />
                    <Form.Label>{t('yourUsername')}</Form.Label>
                  </Form.Group>
                  <Form.Group controlId="password" className="form-floating mb-4">
                    <Form.Control type="password" placeholder={t('password')} required value={f.values.password} onChange={f.handleChange} isInvalid={error !== ''} />
                    <Form.Label>{t('password')}</Form.Label>
                    {error && <div class="invalid-tooltip">{error}</div>}
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                    {t('login')}
                  </Button>
                </Form>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 text-center">
              <span>{t('dontHaveAccount')}</span> <a href="/signup">{t('signup')}</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </MainContainer>
  )
}