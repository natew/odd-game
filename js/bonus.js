var bonus = {
  run: function() {},
  rarity: 0
};

var invincibleTimeout;
var cloak;

// BONUSES
var b = {
  shoot: function(index) {
    // console.log("shoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car, SHELL_SIZE, 0, false);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    SHELLS.push(shell);
    NUM_SHELLS++;
  },

  invincible: function(index) {
    // console.log("invincible");
    INVINCIBLE[index] = true;

    if (cloak) removeCloak();

    cloak = new THREE.Mesh(
      new THREE.SphereGeometry(60, 60, 60),
      new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.3
      })
    );
    CARS[index].add(cloak);

    clearTimeout(invincibleTimeout);
    invincibleTimeout = setTimeout(function() {
      INVINCIBLE[index] = false;
      removeCloak();
    }, INVINCIBLE_DURATION);

    function removeCloak() {
      CARS[index].remove(cloak);
      cloak = null;
    }
  },

  bigShoot: function(index) {
    // console.log("bigShoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car, BIG_SHELL_SIZE, false);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    SHELLS.push(shell);
    NUM_SHELLS++;
  },
  triShoot: function(index) {
    // console.log("triShoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var spread = Math.PI / 6;
    for (var i = spread * -1; i <= spread; i += spread) {
      var shell = createShell(car, SHELL_SIZE, false);

      shell.radians = (car.rotation.y) % (Math.PI * 2) + i;
      if (shell.radians < 0) shell.radians += Math.PI * 2;
      // console.log(shell.radians * 180 / Math.PI);

      shell.timeElapsed = 0;
      SHELLS.push(shell);
      NUM_SHELLS++;
    }
  },
  seekingShoot: function(index) {
    // console.log("seekingShoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car, SHELL_SIZE, true);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    SHELLS.push(shell);
    NUM_SHELLS++;
  }
};

// SHELL
BONUS_TYPES[0] = _.clone(bonus);
BONUS_TYPES[0].rarity = 7;
BONUS_TYPES[0].run = function(index) {
  b.shoot(index);
};

// INVINCIBILITY
BONUS_TYPES[1] = _.clone(bonus);
BONUS_TYPES[1].rarity = 3;
BONUS_TYPES[1].run = function(index) {
  b.invincible(index);
};

// BIG SHELL
BONUS_TYPES[2] = _.clone(bonus);
BONUS_TYPES[2].rarity = 5;
BONUS_TYPES[2].run = function(index) {
  b.bigShoot(index);
}

BONUS_TYPES[3] = _.clone(bonus);
BONUS_TYPES[3].rarity = 4;
BONUS_TYPES[3].run = function(index) {
  b.triShoot(index);
}

BONUS_TYPES[4] = _.clone(bonus);
BONUS_TYPES[4].rarity = 3;
BONUS_TYPES[4].run = function(index) {
  b.seekingShoot(index);
}

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

// A line of potential bonus positions
for (i = 0; i < TOTAL_BONUSES; i++) {
  xBonuses[i] = 23 - (i * (23 / TOTAL_BONUSES) * 2);
  yBonuses[i] = 16 - (i * (16 / TOTAL_BONUSES) * 2);
  // console.log(xBonuses[i], yBonuses[i])
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
      bonusLen = bonusPositions.length,
      bonusY = CARS[0].position.y,
      given = 0,
      numBonusToGive = Math.ceil(Math.random()*3) + 1,
      i, j,
      lastFoundAt = [0, 0];

      console.log('give', numBonusToGive);

  // Loop through cars positions
  for (i = 0; i < numBonusToGive; i++) {
    var carIndex = i % NUM_CARS,
        carPosX = carPositions[carIndex].x,
        carPosZ = carPositions[carIndex].z;

    // Loop through shuffled bonus positions
    for (j = lastFoundAt[carIndex] + 1; j < bonusLen; j++) {
      // Get bonus position
      var bonusX = bonusPositions[j][0] * SCALE_X,
          bonusZ = bonusPositions[j][1] * SCALE_Y,
          distance = Math.sqrt(
            Math.pow(carPosX - bonusX, 2) + Math.pow(carPosZ - bonusZ, 2)
          );

      // If not too far or close to player, place the bonus
      if (distance > 80 && distance < 200) {
        placeBonus(bonusX, bonusY, bonusZ);
        lastFoundAt[carIndex] = j;
        if (++given == numBonusToGive) return;
        break;
      }
    }
  }
}

function placeBonus(bonusX, bonusY, bonusZ) {
  var bonus = new THREE.Mesh( bonusGeometry, bonusMaterial );
  bonus.rotation.z = 2;
  bonus.rotation.y = 3;
  bonus.rotation.x = 2;
  bonus.position.set(bonusX, bonusY, bonusZ);
  bonus.material.opacity = 1.0;
  bonus.size = BONUS_SIZE;
  // bonus.typeIndex = 4;
  bonus.typeIndex = getBonusType();
  WORLD.add(bonus);
  BONUSES.push(bonus);
}

function clearBonuses() {
  // console.log(BONUSES.length)
  _.each(BONUSES, function(bonus) {
    WORLD.remove(bonus);
  });
  BONUSES = [];
}

function getBonusType() {
  var currentPick = -1;
  var highestProb = 0;
  for (var i = 0; i < BONUS_TYPES.length; i++) {
    var prob = Math.random() * BONUS_TYPES[i].rarity;
    if (prob > highestProb) {
      currentPick = i;
      highestProb = prob;
    }
  }
  // console.log('pick: ', currentPick);
  return currentPick;
}

function removeBonus(index) {
  // console.log(BONUSES[index]);
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
    var less = BONUS_DURATION * delta / 120000;
    bonus.material.opacity -= less;
  }
}

function givePlayerBonus(pIndex, bIndex) {
  var bonusTypeIndex = BONUSES[bIndex].typeIndex;
  PLAYER_BONUSES[pIndex].push(_.clone(BONUS_TYPES[bonusTypeIndex]));
  removeBonus(bIndex);
}