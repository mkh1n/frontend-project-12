/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channelsList: [],
  currentChannelId: 1,
};

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelsList: (state, { payload }) => {
      state.channelsList = payload;
    },
    addChannel: (state, { payload }) => {
      state.channelsList.push(payload);
    },
    removeChannel: (state, { payload }) => {
      if (payload.id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
      console.log('deleted channel with id ', payload.id);
      const index = state.channelsList.findIndex((channel) => channel.id === payload.id);
      if (index !== -1) {
        state.channelsList.splice(index, 1);
      }
    },
    renameChannel: (state, { payload }) => {
      const updatedChannels = state
        .channelsList.map((channel) => (channel.id === payload.id ? payload : channel));
      state.channelsList = updatedChannels;
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const {
  setChannelsList, setCurrentChannelId, addChannel, removeChannel, renameChannel,
} = slice.actions;

export default slice.reducer;

export const selectChannels = (state) => state.channels.channelsList;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
