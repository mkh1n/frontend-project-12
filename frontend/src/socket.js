import { io } from 'socket.io-client';
import { removeChannel, addChannel, renameChannel } from './slices/channelsSlice';
import { addMessage, editMessage, removeMessage } from './slices/messagesSlice';
import { store } from './store';

const socket = io('http://localhost:5001');

socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

const subscribeToSocketEvents = () => {
  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });

  socket.on('renameMessage', (payload) => {
    console.log(payload)
    store.dispatch(editMessage(payload))
  });

  socket.on('removeMessage', (payload) => {
    console.log(payload)
    store.dispatch(removeMessage(payload))
  });

  socket.on('newChannel', (payload) => {
    console.log(payload)
    store.dispatch(addChannel(payload));
  });

  socket.on('removeChannel', (payload) => {
    console.log(payload)
    store.dispatch(removeChannel(payload))
  });

  socket.on('renameChannel', (payload) => {
    console.log(payload)
    store.dispatch(renameChannel(payload))
  });
}

export default subscribeToSocketEvents;