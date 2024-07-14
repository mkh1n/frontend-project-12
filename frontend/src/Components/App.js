import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';
import MainPage from './MainPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage/> } />
        <Route path="/" element={<MainPage/> } />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
