import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';
import mobileMenuReducer from './slices/mobileMenuSlice';

const saveAuthToLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === 'auth/login') { /* eslint-disable-line */
    const authState = store.getState().auth;
    localStorage.setItem('user', JSON.stringify(authState)); /* eslint-disable-line */
  }
  return result;
};

export default configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    mobileMenu: mobileMenuReducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(saveAuthToLocalStorageMiddleware)),
});
