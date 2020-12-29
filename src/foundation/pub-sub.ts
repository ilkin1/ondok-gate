const client = require('socket.io-emitter')({
  host: '127.0.0.1', port: 6379
});

function user(user: any) {
  const id = typeof user === 'number' ? user : user.id;
  return client.to(`u:${id}`);
}

export default {client, user}
