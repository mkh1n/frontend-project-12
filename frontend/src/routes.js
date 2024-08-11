const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signUpPath: () => [apiPath, 'signup'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  channelPath: (id) => [apiPath, 'channels', id].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  messagePath: (id) => [apiPath, 'messages', id].join('/'),
};
