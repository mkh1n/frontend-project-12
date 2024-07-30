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
      console.log('addmessage')
      state.push(payload);
    },
    removeMessage: (state, {payload}) => {
      console.log('deleted message with id ', payload.id)
      return state.filter((message) => message.id !== payload.id);
    },
    editMessage: (state, {payload}) => {
      return state.map((message) => message.id == payload.id ? payload : message);
    },
  },
})

export const { setMessages, addMessage, removeMessage, editMessage } = slice.actions

export default slice.reducer

export const selectMessages = (state) => state.messages
