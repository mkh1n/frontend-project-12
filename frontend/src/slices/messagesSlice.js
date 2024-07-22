import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, {payload}) => {
      state.splice(0, state.length, ...payload);
    },
    addMessage: (state, {payload}) => {
      state.push(payload);
    },
    removeMessage: (state, {payload}) => {
      state = state.filter((message)=> message.id !== payload);
    }
  },
})

export const { setMessages, addMessage, removeMessage } = slice.actions

export default slice.reducer

export const selectMessages = (state) => state.messages
