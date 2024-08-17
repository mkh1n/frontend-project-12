/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channelsList: [],
  currentChannelId: 1,
  isChannelCreator: false,
};

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelsList: (state, { payload }) => {
      state.channelsList = payload; /* eslint-disable-line */
    },
    addChannel: (state, { payload }) => {
      state.channelsList.push(payload); /* eslint-disable-line */
      if (state.isChannelCreator) { /* eslint-disable-line */
        state.currentChannelId = payload.id; /* eslint-disable-line */
        state.isChannelCreator = false; /* eslint-disable-line */
      }
    },
    removeChannel: (state, { payload }) => {
      if (+payload.id === +state.currentChannelId) { /* eslint-disable-line */
        state.currentChannelId = 1; /* eslint-disable-line */
      }
      const index = state.channelsList.findIndex((channel) => channel.id === payload.id);
      if (index !== -1) { /* eslint-disable-line */
        state.channelsList.splice(index, 1); /* eslint-disable-line */
      }
    },
    renameChannel: (state, { payload }) => {
      const updatedChannels = state
        .channelsList.map((channel) => (channel.id === payload.id ? payload : channel));
      state.channelsList = updatedChannels; /* eslint-disable-line */
      if (state.isChannelCreator) { /* eslint-disable-line */
        state.currentChannelId = payload.id; /* eslint-disable-line */
        state.isChannelCreator = false;/* eslint-disable-line */
      }
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload; /* eslint-disable-line */
    },
    setIsChannelCreator: (state, { payload }) => {
      state.isChannelCreator = payload; /* eslint-disable-line */
    },
  },
});

export const {
  setChannelsList, setCurrentChannelId,
  addChannel, removeChannel, renameChannel,
  setIsChannelCreator,
} = slice.actions;

export default slice.reducer;

export const selectChannels = (state) => state.channels.channelsList;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;
