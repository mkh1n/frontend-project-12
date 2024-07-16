import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import channelsReducer from './slices/channelsSlice';

const saveAuthToLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === 'auth/setCurrentUser') {
    const authState = store.getState().auth;
    localStorage.setItem('user', JSON.stringify(authState));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveAuthToLocalStorageMiddleware),
});