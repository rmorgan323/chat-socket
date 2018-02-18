var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', socket => {
  let user = `Roberto-${moment(Date.now()).format('LT')}`

  socket.broadcast.emit('user connect', `${user} has joined.`);

  socket.on('chat message', function(message) {
    io.emit('chat message', `${user}: ${message}`);
  });

  socket.on('is typing', (message) => {
    socket.broadcast.emit('is typing', message)
  })

  socket.on('disconnect', () => {
    io.emit('user disconnect', `${user} has left.`)
  });
});
