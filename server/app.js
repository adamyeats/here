const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Server } = require('socket.io');
const { instrument, RedisStore } = require('@socket.io/admin-ui');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_TLS_URL);
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true
  }
});

// express config
app.set('port', 3000);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../client/build')));

// socket.io admin
instrument(io, {
  auth: false,
  store: new RedisStore(redis)
});

// socket.io
io.on('connection', socket => {
  redis.smembers('locations').then(members => {
    io.emit(
      'location',
      members.map(m => JSON.parse(m))
    );
  });

  socket.on('location', msg => {
    redis.sadd('locations', JSON.stringify(msg));
  });
});

// default route handler
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

server.listen(3000);
