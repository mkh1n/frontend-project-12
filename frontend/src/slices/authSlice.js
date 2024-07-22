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
    setCurrentUser: (state, {payload: { name, token },}) => {
      state.name = name
      state.token = token
      return state;
    },
  },
})

export const { setCurrentUser } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state) => state.auth
