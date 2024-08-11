import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import App from './Components/App';
import { store } from './store';
import i18n from './localization/i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '80fe158640cd4d8e9ea38371f1682cfd',
  environment: 'testenv',
};

const root = ReactDOM.createRoot(document.getElementById('chat'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </RollbarProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
);
