import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('chat'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

