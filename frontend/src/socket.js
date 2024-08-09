import { io } from 'socket.io-client';
import { addChannel, removeChannel, renameChannel, setCurrentChannelId } from './slices/channelsSlice';
import { addMessage, editMessage, removeMessage } from './slices/messagesSlice';
import { toggleMenu } from './slices/mobileMenuSlice';
import { store } from './store';

let socket;
let isSubscribed = false;

const getSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}`;
};

const subscribeToSocketEvents = () => {
  if (!isSubscribed) {
    socket = io(getSocketUrl());

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('newMessage', (payload) => {
      console.log('Socket event: newMessage', payload);
      store.dispatch(addMessage(payload));
      
    });

    socket.on('renameMessage', (payload) => {
      console.log('Socket event: renameMessage', payload);
      store.dispatch(editMessage(payload));
    });

    socket.on('removeMessage', (payload) => {
      console.log('Socket event: removeMessage', payload);
      store.dispatch(removeMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      console.log('Socket event: newChannel', payload);
      store.dispatch(addChannel(payload));
      store.dispatch(setCurrentChannelId(payload.id))
    });

    socket.on('removeChannel', (payload) => {
      console.log('Socket event: removeChannel', payload);
      store.dispatch(removeChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      console.log('Socket event: renameChannel', payload);
      store.dispatch(renameChannel(payload));
      store.dispatch(setCurrentChannelId(payload.id))
    });

    isSubscribed = true;
  }
}

export default subscribeToSocketEvents;
