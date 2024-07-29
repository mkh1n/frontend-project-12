import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channelsList: [],
  currentChannelId: 1,
}
const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelsList: (state, {payload}) => {
      state.channelsList = payload
      return state
    },
    addChannel: (state, {payload}) => {
      state.channelsList.push(payload);
    },
    removeChannel: (state, {payload}) => {
      if (payload.id == state.currentChannelId){
        state.currentChannelId = 1;
      }
      console.log('deleted channel with id ', payload.id)
      state.channelsList.splice(state.channelsList.findIndex((channel) => channel.id === payload.id), 1);
    },
    renameChannel: (state, {payload}) => {  
      state.channelsList = state.channelsList.map((channel) => channel.id == payload.id ? payload : channel)
    },
    setCurrentChannelId: (state, {payload}) => {
      state.currentChannelId = payload
      return state
    },
  },
})

export const { setChannelsList, setCurrentChannelId, addChannel, removeChannel, renameChannel} = slice.actions

export default slice.reducer

export const selectChannels = (state) => state.channels.channelsList
export const selectCurrentChannelId = (state) => state.channels.currentChannelId

