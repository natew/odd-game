var socket = io.connect('http://localhost:9001');
var shoot = io.connect('http://localhost:9002');

socket.on('message', function (data) {
  // console.log(data);
  setData(data);

});

shoot.on('message', function(data) {
	console.log(data);
  if (data.message.indexOf("green") != -1) {
  	playerAction(0);
  }
  else if (data.message.indexOf("red") != -1) {
  	playerAction(1);
  }
});

function setData(data) {
  DATA_PREV[data.carId] = DATA;
  DATA[data.carId] = data;
}