import React, { useState } from 'react';
import axios from 'axios';
import {
  Row, Col, Card, Form, Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { login } from '../slices/authSlice';
import routes from '../routes';
import MainContainer from './MainContainer';

const sendAuthRequest = async (dispatch, loginValues) => {
  const res = await axios.post(routes.signUpPath(), loginValues);
  const { token, username } = res.data;
  dispatch(login({ name: username, token }));
};

const SignupPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const schema = yup.object({
    username: yup
      .string()
      .required(t('emptyUsernameSignUpError'))
      .min(3, t('minMaxError'))
      .max(20, t('minMaxError')),
    password: yup
      .string()
      .required(t('emptyPasswordSignUpError'))
      .min(6, t('minPasswordSignUpError')),
    confirmPassword: yup
      .string()
      .required(t('confirmPassword'))
      .oneOf([yup.ref('password'), null], t('confirmPasswordSignupError')),
  });

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        await sendAuthRequest(dispatch, values);
        navigate('/');
      } catch (err) {
        f.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 409) {
          setError(t('uniqueUsernameSignupError'));
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
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src="https://thrivemyway.com/wp-content/uploads/2022/10/Cool-Instagram-Names-1536x912.png" alt={t('doSignup')} className="rounded-circle mb-4" style={{ width: '400px' }} />
              </Col>
              <Col xs={12} md={6}>
                <Form onSubmit={f.handleSubmit}>
                  <h1 className="text-center mb-4">{t('signup')}</h1>
                  <Form.Group controlId="username" className="form-floating mb-3">
                    <Form.Control
                      type="text"
                      placeholder={t('username')}
                      required
                      value={f.values.username}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      isInvalid={!!f.errors.username && f.touched.username}
                    />
                    <Form.Label>{t('username')}</Form.Label>
                    {f.errors.username && f.touched.username && <div className="invalid-tooltip">{f.errors.username}</div>}
                  </Form.Group>
                  <Form.Group controlId="password" className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      placeholder={t('password')}
                      required
                      value={f.values.password}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      isInvalid={!!f.errors.password && f.touched.password}
                    />
                    <Form.Label>{t('password')}</Form.Label>
                    {f.errors.password && f.touched.password && <div className="invalid-tooltip">{f.errors.password}</div>}
                  </Form.Group>
                  <Form.Group controlId="confirmPassword" className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      placeholder={t('confirmPassword')}
                      required
                      value={f.values.confirmPassword}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                      isInvalid={!!f.errors.confirmPassword && f.touched.confirmPassword}
                    />
                    <Form.Label>{t('confirmPassword')}</Form.Label>
                    {f.errors.confirmPassword && f.touched.confirmPassword && <div className="invalid-tooltip">{f.errors.confirmPassword}</div>}
                    {error && <div className="invalid-tooltip">{error}</div>}
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                    {t('doSignup')}
                  </Button>
                </Form>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 text-center">
              <span>{t('hasAccount')}</span>
              {' '}
              <a href="/login">{t('login')}</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </MainContainer>
  );
};

export default SignupPage;
