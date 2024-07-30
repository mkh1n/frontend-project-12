import { io } from 'socket.io-client';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';
import { addMessage, editMessage, removeMessage } from './slices/messagesSlice';
import { store } from './store';

let socket;
let isSubscribed = false;

const subscribeToSocketEvents = () => {
  if (!isSubscribed) {
    socket = io('http://localhost:5001');

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
    });

    socket.on('removeChannel', (payload) => {
      console.log('Socket event: removeChannel', payload);
      store.dispatch(removeChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      console.log('Socket event: renameChannel', payload);
      store.dispatch(renameChannel(payload));
    });

    isSubscribed = true;
  }
}

export default subscribeToSocketEvents;
