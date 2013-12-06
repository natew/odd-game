var bonus = {
  playerIndex: 0,
  run: function() {}
};

var invincibleTimeout

// BONUSES
var b = {
  shoot: function(index) {
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    SHELLS.push(shell);
    NUM_SHELLS++;
  },

  invincible: function(index) {
    INVINCIBLE[index] = true;
    setTimeout(function() {
      INVINCIBLE[index] = false;
    }, 10000);
  }
};

// SHELL
BONUS_TYPES[0] = _.clone(bonus);
BONUS_TYPES[0].run = function() {
  b.shoot(this.playerIndex);
};

// INVINCIBILITY
BONUS_TYPES[1] = _.clone(bonus);
BONUS_TYPES[1].run = function() {
  b.invincible(this.playerIndex);
};

// Start placing them on the board
function startBonuses() {
  // Bonuses appear every so often
  giveBonuses();
  setInterval(function() {
    giveBonuses();
  }, BONUS_DURATION);
}

// vars for placing bonuses
var i,
    xBonuses = [],
    yBonuses = [],
    TOTAL_BONUSES = 20,
    bonusPositions,
    givePerTurn = 2;

// A line of bonus indexes
for (i = 0; i < TOTAL_BONUSES; i++) {
  xBonuses[i] = 25 - (i * (25 / TOTAL_BONUSES) * 2);
  yBonuses[i] = 18 - (i * (18 / TOTAL_BONUSES) * 2);
}

// Shuffle them up
function shuffleBonuses() {
  bonusPositions = _.zip(_.shuffle(xBonuses), _.shuffle(yBonuses));
}

var bonusMaterial = new THREE.MeshPhongMaterial({
      color: colors['bonus'],
      transparent: true,
      opacity: 1.0
    }),
    bonusGeometry = new THREE.CubeGeometry(BONUS_SIZE, BONUS_SIZE, BONUS_SIZE, 1, 1, 1);

// Drop a bonus on the board!
function giveBonuses() {
  clearBonuses();
  shuffleBonuses();

  // Get car positions as of meow
  var carPositions = _.map(CARS, function(car) { return car.position }),
      // Shuffle potential bonus spots
      i, len = bonusPositions.length,
      bonusY = CARS[0].position.y,
      given = 0;

  // Loop through shuffled bonus positions
  for (i = 0; i < len; i++) {
    // Get bonus position
    var bonusX = bonusPositions[i][0] * SCALE_X,
        bonusZ = bonusPositions[i][1] * SCALE_Y;

        // console.log('checking bonus', bonusX, bonusZ);

    // Loop through cars positions
    var j, didntHit = [false, false];
    for (j = 0; j < NUM_CARS; j++) {
      var carPosX = carPositions[j].x,
          carPosZ = carPositions[j].z;

      // console.log(j, "" + carPosX + "/" + bonusX, "" + carPosZ + "/" + bonusZ);

      var distance = Math.sqrt( Math.pow(carPosZ - bonusX, 2) + Math.pow(carPosZ - bonusZ, 2)  );
      // console.log('dist', distance);

      if (distance > 200) didntHit[j] = true;
    }

    if (didntHit[0] && didntHit[1]) {
      // console.log('create bonus', bonusX, bonusZ);
      var bonus = new THREE.Mesh( bonusGeometry, bonusMaterial );
      bonus.rotation.z = 2;
      bonus.rotation.y = 3;
      bonus.rotation.x = 2;
      bonus.position.set(bonusX, bonusY, bonusZ);
      bonus.castShadow = true;
      bonus.shadowDarkness = 1.0;
      bonus.material.opacity = 1.0;
      bonus.size = BONUS_SIZE;
      bonus.typeIndex = 0;
      WORLD.add(bonus);
      BONUSES.push(bonus);

      if (++given == givePerTurn) return;
    }
  }
}

function clearBonuses() {
  console.log(BONUSES.length)
  _.each(BONUSES, function(bonus) {
    WORLD.remove(bonus);
  });
  BONUSES = [];
}

function removeBonus(index) {
  console.log(BONUSES[index]);
  WORLD.remove(BONUSES[index]);
  BONUSES.splice(index, 1);
}

function rotateBonus() {
  var xAxis = new THREE.Vector3(0,0,1);
  for (var i = 0; i < BONUSES.length; i++) {
    var bonus = BONUSES[i];
    bonus.rotateOnAxis( xAxis, Math.PI / 180 );
  }
}

function fadeBonus(delta) {
  // console.log(delta);
  for (var i = 0; i < BONUSES.length; i++) {
    var bonus = BONUSES[i];
    bonus.material.opacity -= BONUS_DURATION * delta / 60000;
  }
}

function givePlayerBonus(pIndex, bIndex) {
  var bonusTypeIndex = BONUSES[bIndex].typeIndex;
  PLAYER_BONUSES[pIndex].push(_.clone(BONUS_TYPES[bonusTypeIndex]));
  removeBonus(bIndex);
}