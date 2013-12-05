var io = require('socket.io').listen(9001);

io.sockets.on('connection', function (socket) {

  setInterval(function() {
    var message = {
      x: Math.random() * 32 - 18,
      y: Math.random() * 32 - 18,
      theta: 1
    };

    socket.emit('message', message);
    console.log(message, "\n");
  }, 5);

});