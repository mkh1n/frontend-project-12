import { createSlice } from '@reduxjs/toolkit';

const userString = localStorage.getItem('user');
const user = JSON.parse(userString);


const authState = {
  username: user ? user.username : null,
  token: user ? user.token : null
}
console.log('localstorage:', user, 'slice: ', authState);

const slice = createSlice({
  name: 'auth',
  initialState: authState,
  reducers: {
    setCurrentUser: (state, {payload: { user, token },}) => {
      state.user = user
      state.token = token
    },
  },
})

export const { setCurrentUser } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state) => state.auth.user
