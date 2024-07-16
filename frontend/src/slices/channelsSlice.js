import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channelsList: [],
  currentChannelId: 0,
}
const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelsList: (state, {payload}) => {
      state.channelsList = payload
      return state
    },
    setCurrentChannel: (state, {payload}) => {
      state.currentChannelId = payload
      return state
    },
  },
})

export const { setChannelsList, setCurrentChannel} = slice.actions

export default slice.reducer

export const selectChannels = (state) => state.channels.channelsList
export const selectCurrentChannelId = (state) => state.channels.currentChannelId

