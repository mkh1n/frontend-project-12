import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Header from './Header';
import { useFormik } from 'formik';

export default () => {
  const f = useFormik({
    initialValues: {
      login: '',
      password: ''
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Container fluid className="h-100 p-0">
      <Header />
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className='row p-5'>
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src="https://www.ukpropertyaccountants.co.uk/wp-content/uploads/2023/06/10312222_18208786-min-scaled.jpg" alt="Войти" className="rounded-circle mb-4" style={{width: "200px"}}/>
              </Col>
              <Col xs={12} md={6}>
                <Form onSubmit={f.handleSubmit}>
                  <h1 className="text-center mb-4">Войти</h1>
                  <Form.Group controlId="username" className="form-floating mb-3">
                    <Form.Control type="text" placeholder="Ваш ник" required value={f.values.login} onChange={f.handleChange} />
                    <Form.Label>Ваш ник</Form.Label>
                  </Form.Group>
                  <Form.Group controlId="password" className="form-floating mb-4">
                    <Form.Control type="password" placeholder="Пароль" required value={f.values.password} onChange={f.handleChange} />
                    <Form.Label>Пароль</Form.Label>
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                    Войти
                  </Button>
                </Form>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4 text-center">
              <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}