import { io } from 'socket.io-client';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';
import { addMessage, editMessage, removeMessage } from './slices/messagesSlice';
import store from './store';

let socket; /* eslint-disable-line */
let isSubscribed = false; /* eslint-disable-line */

const getSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const { host } = window.location;
  return `${protocol}//${host}`;
};

const subscribeToSocketEvents = () => {
  if (!isSubscribed) { /* eslint-disable-line */
    socket = io(getSocketUrl()); /* eslint-disable-line */

    socket.on('connect', () => { /* eslint-disable-line */
      console.log('Socket connected'); /* eslint-disable-line */
    });

    socket.on('disconnect', () => { /* eslint-disable-line */
      console.log('Socket disconnected'); /* eslint-disable-line */
    });

    socket.on('newMessage', (payload) => { /* eslint-disable-line */
      store.dispatch(addMessage(payload)); /* eslint-disable-line */
    });

    socket.on('renameMessage', (payload) => { /* eslint-disable-line */
      store.dispatch(editMessage(payload)); /* eslint-disable-line */
    });

    socket.on('removeMessage', (payload) => { /* eslint-disable-line */
      store.dispatch(removeMessage(payload)); /* eslint-disable-line */
    });

    socket.on('newChannel', (payload) => { /* eslint-disable-line */
      store.dispatch(addChannel(payload)); /* eslint-disable-line */
    });

    socket.on('removeChannel', (payload) => { /* eslint-disable-line */
      store.dispatch(removeChannel(payload)); /* eslint-disable-line */
    });

    socket.on('renameChannel', (payload) => { /* eslint-disable-line */
      store.dispatch(renameChannel(payload)); /* eslint-disable-line */
    });

    isSubscribed = true; /* eslint-disable-line */
  }
};

export default subscribeToSocketEvents;
