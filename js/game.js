
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
  // console.log('do', bonus, index);
  bonus.run(index);
}

// 25 x, 18 y
// var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
//     shellGeometry = new THREE.CubeGeometry(SHELL_SIZE, SHELL_SIZE, SHELL_SIZE, 1, 1, 1);

function createShell(car, shellSize, attributes) {
  // var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] }),
  //     shellGeometry = new THREE.CubeGeometry(shellSize, shellSize, shellSize, 1, 1, 1);
  var shell = OBJECTS['shell'].clone(),
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
  shell.seeking = _.contains(attributes, "seeking");
  shell.pulse = _.contains(attributes, "pulse");
  WORLD.add(shell);
  return shell;
}

function createBanana(car, bananaSize) {
  var banana = OBJECTS['banana'].clone(),
      carAngle = car.rotation.y + (Math.PI / 2),
      bananaX = (80 + bananaSize / 2) * Math.sin(carAngle) * -1,
      bananaZ = (80 + bananaSize / 2) * Math.cos(carAngle) * -1;

  banana.position.set(car.position.x + bananaX, car.position.y, car.position.z + bananaZ);
  banana.size = bananaSize;
  WORLD.add(banana);
  BANANAS.push(banana);
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
  if (NUM_SHELLS) {
    var i, shell, x, y;
    for (i = 0; i < NUM_SHELLS; i++) {
      shell = SHELLS[i];

      collisionDetectShell(shell, i);
      moveShell(shell);

      if (++shell.timeElapsed > SHELL_DURATION) {
        removeShell(i);
      }
    }
  }
}
var seekBuffer = [];
function moveShell(shell) {
  dist = SHELL_SPEED;
  // console.log(shell.seeking);
  if (shell.seeking) {
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
    // var distToOpp = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    // var dTheta = (Math.atan2(dY, dX) * -1) - shell.radians;
    // console.log(dTheta);
    // if (Math.abs(dTheta) > 1) {
    //   // console.log(shell.radians, (shell.radians + dTheta / 2), (-1 * Math.atan2(dY, dX)));
    //   // shell.radians += dTheta / 2;
    // }
    // else {
    //   shell.radians = -1 * Math.atan2(dY, dX);

    // }
    // shell.radians += (dTheta / 100) % (Math.PI * 2);
    // console.log(distToOpp, dTheta);
  }

  if (shell.pulse) {
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

function removeShell(index) {
  WORLD.remove(SHELLS[index]);
  // renderer.deallocateObject(SHELLS[index]);
  SHELLS.splice(index, 1);
  NUM_SHELLS--;
  seekBuffer = [];
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
  console.log(player_score);
  updateScore(index, player_score);

  if (player_score == 0) {
    showBanner("" + (1 - index + 1) + ' WINS!');
    GAME_OVER = true;
    clearInterval(BONUS_INTERVAL);
  }
}

function doIntro() {
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
