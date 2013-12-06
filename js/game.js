
function moveForward(car, moveDistance) {
  var carAngle = car.rotation.y + (Math.PI / 2),
      moveX = 80 * Math.sin(carAngle),
      moveY = 80 * Math.cos(carAngle);

  car.position.x += moveX * MOVE_SPEED;
  car.position.z += moveY * MOVE_SPEED;
}

function moveBackward(car, moveDistance) {
  var carAngle = car.rotation.y + (Math.PI / 2),
      moveX = 80 * Math.sin(carAngle),
      moveY = 80 * Math.cos(carAngle);

  car.position.x -= moveX * MOVE_SPEED;
  car.position.z -= moveY * MOVE_SPEED;
}

function playerAction(index) {
  if (!PLAYER_BONUSES[index].length) return;
  var bonus = PLAYER_BONUSES[index].shift();
  console.log('do bonus', PLAYER_BONUSES[index])
  bonus.run(index);
}

// 25 x, 18 y
// var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
//     shellGeometry = new THREE.CubeGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE, 1, 1, 1);

function createShell(car, shellSize) {
  var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
      shellGeometry = new THREE.CubeGeometry(shellSize, shellSize, shellSize, 1, 1, 1);
  var shell = new THREE.Mesh( shellGeometry, shellMaterial ),
      carAngle = car.rotation.y + (Math.PI / 2),
      shellX = (80 + shellSize / 2) * Math.sin(carAngle),
      shellZ = (80 + shellSize / 2) * Math.cos(carAngle);

  shell.position.set(car.position.x + shellX, car.position.y, car.position.z + shellZ);
  shell.fromCar = car.index;
  // shell.geometry.dynamic = true;
  // shell.geometry.verticesNeedUpdate = true;
  // shell.geometry.normalsNeedUpdate = true;
  shell.castShadow = true;
  shell.shadowDarkness = 0.5;
  shell.size = shellSize;
  WORLD.add(shell);
  return shell;
}

function moveCar() {
  var i, len = DATA.length;

  // move cars
  for (i = 0; i < len; i++) {
    var cur_data = DATA[i];
    if (!cur_data || cur_data === DATA_PREV[i]) return;

    var index = cur_data.id,
        x = cur_data.x,
        y = cur_data.y,
        theta = cur_data.theta;

    // console.log(x * SCALE_X);
    CARS[index].position.x = x * SCALE_X;
    CARS[index].position.z = - (y * SCALE_Y);
    CARS[index].rotation.y = theta;
  }
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
  // renderer.deallocateObject(SHELLS[index]);
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