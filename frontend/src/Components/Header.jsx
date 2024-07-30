import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { logout, selectCurrentUser } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login')
  }
  const goToGomePage = () => {
    navigate('/')
  }
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand onClick={goToGomePage} role="button">Hexlet Chat</Navbar.Brand>
        {Object.keys(currentUser).length !== 0 ?
          <Navbar.Collapse className="justify-content-end">
          <Navbar.Text id="headerUsername">
            {currentUser.name}
          </Navbar.Text>
          <Button type='primary' onClick={handleLogout}>{t('logout')}</Button>
        </Navbar.Collapse>
        : ''
        }
      </Container>
    </Navbar>
  )
}