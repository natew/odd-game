var socket = io.connect('http://localhost:9001');
socket.on('message', function (data) {
  // console.log(data);
  setData(data);
});

function setData(data) {
  PREV_DATA[data.id] = DATA;
  DATA[data.id] = data;
}