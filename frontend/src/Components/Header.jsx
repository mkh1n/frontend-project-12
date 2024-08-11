import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { toggleMenu, selectMobileMenuState } from '../slices/mobileMenuSlice';
import { logout, selectCurrentUser } from '../slices/authSlice';

const BurgerButton = ({ isMenuOpen, onClick, ref }) => (
  <Button
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
);
const Header = () => {
  const { t } = useTranslation();
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isMenuOpen = useSelector(selectMobileMenuState);

  const handleLogout = () => {
    dispatch(logout()); /* eslint-disable-line */
    navigate('/login'); /* eslint-disable-line */
  };
  const handleMenuClick = () => {
    dispatch(toggleMenu()); /* eslint-disable-line */
  };
  const goToGomePage = () => {
    navigate('/'); /* eslint-disable-line */
  };

  useEffect(() => { /* eslint-disable-line */
    const listener = (event) => {
      if (isMenuOpen && !event.target.closest('#channelsHolder') && !event.target.closest('#burgerButton')) { /* eslint-disable-line */
        dispatch(toggleMenu()); /* eslint-disable-line */
      }
    };

    document.addEventListener('mousedown', listener); /* eslint-disable-line */
    return () => {
      document.removeEventListener('mousedown', listener); /* eslint-disable-line */
    };
  }, [dispatch, isMenuOpen]);

  return (
    <Navbar bg="light" data-bs-theme="light" style={{ position: 'sticky' }}>
      <Container>
        {Object.keys(currentUser).length !== 0
          ? <BurgerButton isMenuOpen={isMenuOpen} onClick={handleMenuClick} ref={mobileMenuRef} />
          : ''}
        <Navbar.Brand onClick={goToGomePage} role="button">Hexlet Chat</Navbar.Brand>
        {Object.keys(currentUser).length !== 0
          ? (
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text id="headerUsername">
                {currentUser.name}
              </Navbar.Text>
              <Button type="primary" onClick={handleLogout}>{t('logout')}</Button>
            </Navbar.Collapse>
          )
          : ''}
      </Container>
    </Navbar>
  );
};

export default Header;
