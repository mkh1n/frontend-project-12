import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import { Provider } from 'react-redux';
import { store } from './store';
import i18n from './localization/i18next';
import { I18nextProvider } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('chat'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

if (module.hot) {
  module.hot.accept();
}

