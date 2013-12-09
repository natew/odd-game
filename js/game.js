
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
  // restart game when user fires and game is over
  if (GAME_OVER) { window.location.reload(); }

  if (!PLAYER_BONUSES[index].length) return;
  var bonus = PLAYER_BONUSES[index].shift();
  // console.log('do', bonus, index);
  bonus.run(index);
  if (PLAYER_BONUSES[index].length) {
    console.log(PLAYER_BONUSES[index]);
    PLAYER_BONUSES[index][0].pickUp(index);
  }
}

// 25 x, 18 y
// var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
//     shellGeometry = new THREE.CubeGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE, 1, 1, 1);

function createShell(car, shellSize, shellColor, attributes) {
  // var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
  //     shellGeometry = new THREE.CubeGeometry(shellSize, shellSize, shellSize, 1, 1, 1);
  var shell = OBJECTS['shell_' + shellColor].clone(),
      carAngle = car.rotation.y + (Math.PI / 2),
      shellX = (80 + shellSize / 2) * Math.sin(carAngle),
      shellZ = (80 + shellSize / 2) * Math.cos(carAngle);

  shell.position.set(car.position.x + shellX, car.position.y, car.position.z + shellZ);
  shell.fromCar = car.index;
  // shell.geometry.dynamic = true;
  // shell.geometry.verticesNeedUpdate = true;
  // shell.geometry.normalsNeedUpdate = true;
  shell.castShadow = true;
  // shell.shadowDarkness = 0.5;
  shell.size = shellSize; //TODO: ADD PULSE IN CREATE SHELL

  shell.scale.x = shell.scale.x * shellSize * .05;
  shell.scale.y = shell.scale.y * shellSize * .05;
  shell.scale.z = shell.scale.z * shellSize * .05;

  shell.attributes = attributes;
  // WORLD.add(shell);
  return shell;
}

function createBanana(car, bananaSize) {
  var banana = OBJECTS['banana'].clone(),
      carAngle = car.rotation.y + (Math.PI / 2),
      bananaX = (80 + bananaSize / 2) * Math.sin(carAngle) * -1,
      bananaZ = (80 + bananaSize / 2) * Math.cos(carAngle) * -1;

  banana.position.set(car.position.x + bananaX, car.position.y, car.position.z + bananaZ);
  banana.size = bananaSize;
  BANANAS.push(banana);
  return banana;
}

function moveCar() {
  var i, len = DATA.length;

  // move cars
  for (i = 0; i < len; i++) {
    var cur_data = DATA[i];
    if (!cur_data || cur_data === DATA_PREV[i]) return;

    var index = cur_data.carId,
        x = cur_data.x,
        y = cur_data.y,
        theta = cur_data.theta;

    // console.log(x * SCALE_X);
    CARS[index].position.x = x * SCALE_X;
    CARS[index].position.z = - (y * SCALE_Y);
    CARS[index].rotation.y = theta;
  }
}

function moveShells() {
  if (SHELLS.length) {
    var i, shell, x, y;
    for (i = 0; i < SHELLS.length; i++) {
      shell = SHELLS[i];

      collisionDetectShell(shell, i);
      moveShell(shell);
      if (_.contains(shell.attributes, "free")) {
        if (++shell.timeElapsed > SHELL_DURATION) {
          removeShell(i);
        }
      }
    }
  }
}
var seekBuffer = [];
function moveShell(shell) {
  if (_.contains(shell.attributes, "free")) {
    dist = SHELL_SPEED;
    // console.log(shell.seeking);
    if (_.contains(shell.attributes, "seeking")) {
      var toCarIndex = 1 - shell.fromCar;
      var oppCar = CARS[toCarIndex];
      var dY = oppCar.position.z - shell.position.z;
      var dX = oppCar.position.x - shell.position.x;
      if (seekBuffer.length < SEEKING_DIFFICULTY) {
        seekBuffer.push(-1 * Math.atan2(dY, dX));
      }
      else {
        shell.radians = seekBuffer.shift();
        seekBuffer.push(-1 * Math.atan2(dY, dX));
      }
    }
    else if (_.contains(shell.attributes, "pulse")) {
      if (shell.timeElapsed % 10 === 0) {
        var scale = 5 * Math.abs(Math.sin(shell.timeElapsed));
        shell.scale.x = scale;
        shell.scale.z = scale;
        // this is hardcoded, I'll fix it later probably
        shell.size = scale * SHELL_SIZE;
      }
    }
    x = dist * Math.cos(shell.radians);
    y = (dist * Math.sin(shell.radians)) * -1;

    shell.position.x += x;
    shell.position.z += y;
  }
  else {
    var car = CARS[shell.fromCar];
    carAngle = car.rotation.y + (Math.PI / 2);
    shell.position.x = car.position.x + (80 + shell.size / 2) * Math.sin(carAngle);
    shell.position.z = car.position.z + (80 + shell.size / 2) * Math.cos(carAngle);
  }
}

function removeShell(index) {
  WORLD.remove(SHELLS[index]);
  // renderer.deallocateObject(SHELLS[index]);
  SHELLS.splice(index, 1);
  seekBuffer = [];
  console.log('shells after remove', SHELLS.length);
}

function removeBanana(index) {
  WORLD.remove(BANANAS[index]);
  BANANAS.splice(index, 1);
}

function carExplode(index) {
  var car = CARS[index];
  // console.log('hit car', index);

  SCORES[index]--;
  var player_score = SCORES[index];
  // console.log(player_score);
  updateScore(index, player_score);

  if (player_score == 0) {
    showBanner("" + (1 - index + 1) + ' WINS!');
    GAME_OVER = true;
    clearInterval(BONUS_INTERVAL);
    playSound('game_over');
  }
}

function doIntro() {

  playSound('count_down');

  showBanner('READY');

  setTimeout(function() {
    showBanner('SET');
  }, 1000);

  setTimeout(function() {
    showBanner('GO!');
  }, 2000);

  setTimeout(function() {
    removeBanner();
  }, 3000);
}
