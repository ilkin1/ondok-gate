import { createServer } from 'http';
import * as Koa from 'koa';
import { EventEmitter } from 'events';
import * as redis from 'socket.io-redis';
// import * as jwt from 'domain/actor/jwt';

const app = new Koa();
const http = createServer(app.callback());
const io = require('socket.io')(http, {
  serveClient: false,
});

io.adapter(redis({ host: '127.0.0.1', port: 6379 }));

// io.use((socket, next) => {
//   let token = socket.handshake.query.jwt;
//   jwt.verify(token).then((payload) => {
//     socket.handshake.actor = payload;
//     next();
//   }).catch(next);
//   // return next(new Error('authentication error'));
// });

io.on('connection', function(sock) {
  // sock.join(`u:${sock.handshake.actor.sub}`);
  sock.on('sub', function(room) {
    sock.join(room);
  });
  sock.on('unsub', function(room) {
    sock.leave(room)
  });
});

const port = 3032;
http.listen(port, () => {
  console.info(`Socket running on port ${port}`);
});
