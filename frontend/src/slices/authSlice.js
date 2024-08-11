/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const getStateFromLocalStorage = () => {
  const stateString = localStorage.getItem('user');
  if (stateString) {
    return JSON.parse(stateString);
  }
  return {};
};

const slice = createSlice({
  name: 'auth',
  initialState: getStateFromLocalStorage(),
  reducers: {
    login: (state, { payload: { name, token } }) => {
      state.name = name; /* eslint-disable-line */
      state.token = token; /* eslint-disable-line */
    },
    logout: () => {
      localStorage.clear(); /* eslint-disable-line */
      return {};
    },
  },
});

export const { login, logout } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state) => state.auth;
