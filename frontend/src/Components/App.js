import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';
import './App.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage/> } />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
