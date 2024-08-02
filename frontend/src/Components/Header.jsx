import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { logout, selectCurrentUser } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleMenu } from '../slices/mobileMenuSlice';
import { selectMobileMenuState } from '../slices/mobileMenuSlice';
import { useEffect, useRef } from 'react';

const BurgerButton = ({ isMenuOpen, onClick, ref }) => {
  return <Button
    className={isMenuOpen ? 'active' : ''}
    id="burgerButton"
    aria-label="Открыть главное меню"
    onClick={onClick}
    ref={ref}
  >
    <span />
    <span />
    <span />
  </Button>
}
export default () => {
  const { t } = useTranslation();
  const mobileMenuRef = useRef(null)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser)
  const isMenuOpen = useSelector(selectMobileMenuState)

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login')
  }
  const handleMenuClick = () => {
    console.log('lol', isMenuOpen)
    dispatch(toggleMenu())
  }
  const goToGomePage = () => {
    navigate('/')
  }


  useEffect(() => {
    console.log(isMenuOpen)

    const listener = () => {
      if (isMenuOpen) {
        handleMenuClick()
      }
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [mobileMenuRef]);


  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        {Object.keys(currentUser).length !== 0 ?
          <BurgerButton isMenuOpen={isMenuOpen} onClick={handleMenuClick} ref={mobileMenuRef} />
          : ''
        }
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