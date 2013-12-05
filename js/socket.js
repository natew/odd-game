var socket = io.connect('http://localhost:9001');
socket.on('message', function (data) {
  console.log(data);
  moveCar(0, data.x, data.y, data.theta);
});