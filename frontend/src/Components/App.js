import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ErrorPage from './ErrorPage';
import MainPage from './mainPage/MainPage';
import './App.css';
import { Provider, ErrorBoundary } from '@rollbar/react' // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: '80fe158640cd4d8e9ea38371f1682cfd',
  environment: 'testenv',
}

function TestError() {
  const a = null
  return a.hello()
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
