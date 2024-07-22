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
    setCurrentChannelId: (state, {payload}) => {
      state.currentChannelId = payload
      return state
    },
  },
})

export const { setChannelsList, setCurrentChannelId} = slice.actions

export default slice.reducer

export const selectChannels = (state) => state.channels.channelsList
export const selectCurrentChannelId = (state) => state.channels.currentChannelId

