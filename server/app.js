const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Server } = require('socket.io');
const Redis = require('ioredis');

// using redis to cache locations in a set
const redis = new Redis(process.env.REDISCLOUD_URL || process.env.REDIS_URL);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// port 3000 is the default port
const PORT = parseInt(process.env.PORT, 10) || 3000;

// express config
app.set('port', PORT);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../client/build')));

// socket.io
io.on('connection', socket => {
  redis.smembers('locations').then(members => {
    io.emit(
      'location',
      members.map(m => JSON.parse(m))
    );
  });

  socket.on('location', msg => {
    // for the sake of brevity, we're just parsing the array
    // to JSON and storing it in redis as a string
    redis.sadd('locations', JSON.stringify(msg));
    io.emit('location', [msg]);
  });
});

// default route handler serving the static assets
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

server.listen(PORT);
