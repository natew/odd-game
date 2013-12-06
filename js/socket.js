var socket = io.connect('http://localhost:9001');
socket.on('message', function (data) {
  console.log(data);
  setData(data);
});

function setData(data) {
  DATA_PREV[data.carId] = DATA;
  DATA[data.carId] = data;
}