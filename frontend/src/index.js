import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import { Provider } from 'react-redux';
import { store } from './store';
import i18n from './localization/i18next';
import { I18nextProvider } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider, ErrorBoundary } from '@rollbar/react' // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: '80fe158640cd4d8e9ea38371f1682cfd',
  environment: 'testenv',
}

const root = ReactDOM.createRoot(document.getElementById('chat'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Provider config={rollbarConfig}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Provider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);

if (module.hot) {
  module.hot.accept();
}

