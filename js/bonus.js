var bonus = {
  run: function() {},
  pickUp: function() {},
  object: null,
  rarity: 0
};

var invincibleTimeout;
var cloak;

// BONUSES
var b = {
  shoot: function(index) {
    var car = CARS[index];
    var shell = car.shell;

    if (shell.attributes) {
      shell.attributes.push("free");
    }
    else {
      shell.attributes = ["free"];
    }

    var newRadians = (car.rotation.y) % (Math.PI * 2);
    if (newRadians < 0) newRadians += Math.PI * 2;
    shell.radians = newRadians;

    shell.timeElapsed = 0;
    car.shell = null;
    playSound('shoot');

  },

  invincible: function(index) {
    // console.log("invincible");
    INVINCIBLE[index] = true;

    if (CAR_PARTICLES[index]) removeParticles(index);
    createParticles(index);

    clearTimeout(invincibleTimeout);
    invincibleTimeout = setTimeout(function() {
      INVINCIBLE[index] = false;
      removeParticles(index);
    }, INVINCIBLE_DURATION);

    function removeCloak() {
      removeParticles(index);
      CAR_PARTICLES[index] = null;
    }
  },

  bigShoot: function(index) {

    var car = CARS[index];
    var shell = car.shell;

    var newShell = createShell(car, BIG_SHELL_SIZE, shell.attributes);
    newShell.attributes.push("free")
    SHELLS[car.shellIndex] = newShell;

    var newRadians = (car.rotation.y) % (Math.PI * 2);
    if (newRadians < 0) newRadians += Math.PI * 2;
    newShell.radians = newRadians;

    newShell.timeElapsed = 0;
    WORLD.add(newShell);
    WORLD.remove(shell);
    car.shell = null;

    playSound('shoot');
  },

  triShoot: function(index) {
    var car = CARS[index];
    var shell = car.shell;

    if (shell.attributes) {
      shell.attributes.push("free");
    }
    else {
      shell.attributes = ["free"];
    }
    var spread = Math.PI / 6;
    for (var i = spread * -1; i <= spread; i += spread * 2) {
      var newShell = createShell(car, SHELL_SIZE, ["free"]);

      newShell.radians = (car.rotation.y) % (Math.PI * 2) + i;
      if (newShell.radians < 0) newShell.radians += Math.PI * 2;
      // console.log(shell.radians * 180 / Math.PI);

      newShell.timeElapsed = 0;
      WORLD.add(newShell);
      SHELLS.push(newShell);
      playSound('shoot');
    }

    var newRadians = (car.rotation.y) % (Math.PI * 2);
    if (newRadians < 0) newRadians += Math.PI * 2;
    shell.radians = newRadians;

    // shell.timeElapsed = 0;
    car.shell = null;
  },

  seekingShoot: function(index) {
    var car = CARS[index];
    var shell = car.shell;
    shell.attributes.push("free");

    var newRadians = (car.rotation.y) % (Math.PI * 2);
    if (newRadians < 0) newRadians += Math.PI * 2;
    shell.radians = newRadians;

    shell.timeElapsed = 0;
    WORLD.add(shell);
    car.remove(shell);
    car.shell = null;

    playSound('shoot');
  },

  dropBanana: function(index) {
    var car = CARS[index];
    var banana = createBanana(car, BANANA_SIZE);
    car.add(banana);
    if (banana.position) banana.position.z = -banana.size;
    console.log('creating banana', banana);
    // banana.position.z = -banana.size;
    WORLD.add(banana);
    // car.add(banana);
  },

  pulseShoot: function(index) {
    // console.log("shoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car, SHELL_SIZE, ["pulse"]);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    SHELLS.push(shell);
    NUM_SHELLS++;
  },
};

var pickUp = {
  shoot: function(index) {
    // console.log("pickUp shoot");

    var car = CARS[index];
    var shell = createShell(car, SHELL_SIZE);
    WORLD.add(shell);

    car.shell = shell;

    SHELLS.push(shell);

    console.log('shells after pickup', SHELLS.length);
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
    var car = CARS[index];
    var shell = createShell(car, BIG_SHELL_SIZE / 2.5, []);
    WORLD.add(shell);

    car.shell = shell;
    car.shellIndex = SHELLS.length;

    SHELLS.push(shell);

  },

  triShoot: function(index) {
    var car = CARS[index];
    // for (var i = 0; i < 3; i++) {
    var shell = createShell(car, SHELL_SIZE);
    WORLD.add(shell);

    car.shell = shell;

    SHELLS.push(shell);
  },

  seekingShoot: function(index) {
    var car = CARS[index];
    var shell = createShell(car, SHELL_SIZE, ["seeking"]);
    WORLD.add(shell);

    car.shell = shell;

    SHELLS.push(shell);

  },

  pulseShoot: function(index) {
    // console.log("shoot");
    var car = CARS[index];
    // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
    var shell = createShell(car, SHELL_SIZE, ["pulse"]);

    shell.radians = (car.rotation.y) % (Math.PI * 2);
    if (shell.radians < 0) shell.radians += Math.PI * 2;
    // console.log(shell.radians * 180 / Math.PI);

    shell.timeElapsed = 0;
    car.shell = shell;
    WORLD.add(shell);
    SHELLS.push(shell);
  },

  dropBanana: function(index) {
    var car = CARS[index];
    var banana = createBanana(car, BANANA_SIZE);
  }
};


// SHELL SHOOT
var shell_bonus = _.clone(bonus);
shell_bonus.rarity = 4;
shell_bonus.run = function (index) { b.shoot(index); };
shell_bonus.pickUp = function(index) { pickUp.shoot(index); }
BONUS_TYPES.push(shell_bonus);

// SEEKING SHOOT
var triShoot_bonus = _.clone(bonus);
triShoot_bonus.rarity = 4;
triShoot_bonus.run = function (index) { b.triShoot(index); };
triShoot_bonus.pickUp = function(index) { pickUp.triShoot(index); }
BONUS_TYPES.push(triShoot_bonus);

// Banana
var banana_bonus = _.clone(bonus);
banana_bonus.rarity = 4;
banana_bonus.run = function(index) { b.dropBanana(index); }
BONUS_TYPES.push(banana_bonus);

// SEEKING SHOOT
var seekingShoot_bonus = _.clone(bonus);
seekingShoot_bonus.rarity = 4;
seekingShoot_bonus.run = function (index) { b.seekingShoot(index); };
seekingShoot_bonus.pickUp = function(index) { pickUp.seekingShoot(index); }
BONUS_TYPES.push(seekingShoot_bonus);

// INVINCIBILITY
var invinciblity = _.clone(bonus);
invinciblity.rarity = 4;
invinciblity.instaGive = true;
invinciblity.run = function(index) { b.invincible(index); };
BONUS_TYPES.push(invinciblity);

// BIG SHELL
var bigShell_bonus= _.clone(bonus);
bigShell_bonus.rarity = 4;
bigShell_bonus.run = function (index) { b.bigShoot(index); };
bigShell_bonus.pickUp = function(index) { pickUp.bigShoot(index); }
BONUS_TYPES.push(bigShell_bonus);

// Start placing them on the board
function startBonuses() {
  // Bonuses appear every so often
  giveBonuses();
  BONUS_INTERVAL = setInterval(function() {
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
      numBonusToGive = Math.ceil(Math.random()*MAX_BONUS_PER_CYCLE)+1,
      i, j,
      lastFoundAt = [0, 0];

      // console.log('give', numBonusToGive);

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
  // bonus.typeIndex = getBonusType();
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
    // console.log('prob', i, prob);
    if (prob > highestProb) {
      currentPick = i;
      highestProb = prob;
    }
  }
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
    var less = BONUS_DURATION * delta / 100000;
    bonus.material.opacity -= less;
  }
}

function givePlayerBonus(pIndex, bIndex) {
  removeBonus(bIndex);

  playSound('pickup', 'player_' + (pIndex + 1));

  var bonusTypeIndex = getBonusType(),
      newBonus = _.clone(BONUS_TYPES[bonusTypeIndex]);

  newBonus.typeIndex = bonusTypeIndex;

  // If we want it to instantly activate the bonus
  if (newBonus.instaGive) {
    newBonus.run(pIndex);
  }
  else {
    // otherwise just push it onto their bonuses
    if (PLAYER_BONUSES[pIndex].length == 0) {
      newBonus.pickUp(pIndex);
      // showPlayerBonus(pIndex, newBonus);
    }
    PLAYER_BONUSES[pIndex].push(newBonus);
  }

}
