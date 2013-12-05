// 25 x, 18 y
var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
    shellGeometry = new THREE.CubeGeometry(30, 30, 30, 1, 1, 1);

function moveForward(car, moveDistance) {
  car.position.z -= moveDistance;
}

function moveBackward(car, moveDistance) {
  car.position.z += moveDistance;
}

function shoot() {
  var car = CARS[activeCar];
  // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
  var shell = createShell(car);

  shell.radians = (car.rotation.y) % (Math.PI * 2);
  if (shell.radians < 0) shell.radians += Math.PI * 2;
  // console.log(shell.radians * 180 / Math.PI);

  shell.timeElapsed = 0;
  SHELLS.push(shell);
  NUM_SHELLS++;
}

function createShell(car) {
  var shell = new THREE.Mesh( shellGeometry, shellMaterial ),
      carAngle = car.rotation.y + (Math.PI / 2),
      shellX = 80 * Math.sin(carAngle),
      shellZ = 80 * Math.cos(carAngle);

  shell.position.set(car.position.x + shellX, car.position.y, car.position.z + shellZ);
  shell.fromCar = car.index;
  // shell.geometry.dynamic = true;
  // shell.geometry.verticesNeedUpdate = true;
  // shell.geometry.normalsNeedUpdate = true;
  WORLD.add(shell);
  return shell;
}

function moveCar() {
  if (!DATA || DATA === DATA_PREV) return;

  var index = 0,
      x = DATA.x,
      y = DATA.y,
      theta = DATA.theta;

  // console.log(x * SCALE_X);
  CARS[index].position.x = x * SCALE_X;
  CARS[index].position.z = - (y * SCALE_Y);
  CARS[index].rotation.y = theta;
}

function moveShell(shell) {
  dist = SHELL_SPEED;
  x = dist * Math.cos(shell.radians);
  y = (dist * Math.sin(shell.radians)) * -1;

  shell.position.x += x;
  shell.position.z += y;
}

function removeShell(index) {
  WORLD.remove(SHELLS[index]);
  SHELLS.splice(index, 1);
  NUM_SHELLS--;
}

function carExplode(index) {
  var car = CARS[index];
  // console.log('hit car', index);

  SCORES[index]--;
  var player_score = SCORES[index];
  console.log(player_score);
  updateScore(index, player_score);

  if (player_score == 0) {
    alert('game over!!!!!!!');
  }
}