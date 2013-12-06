var bonus = {
  playerIndex: 0,
  run: function() {}
};

// BONUSES

// SHELL
BONUS_TYPES[0] = _.clone(bonus);
BONUS_TYPES[0].run = function() {
  shoot(this.playerIndex);
};

// Set number of bonuses
NUM_BONUSES = BONUS_TYPES.length;

//
// Setup first bonuses
givePlayerBonus(0, 0);


// Start placing them on the board
function startBonuses() {
  // Bonuses appear every so often
  giveBonuses();
  setInterval(function() {
    giveBonuses();
  }, 10000);
}

// vars for placing bonuses
var activeBonuses = [],
    i,
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
      transparency: true,
      opacity: 0.2
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
      WORLD.add(bonus);
      BONUSES.push(bonus);
      activeBonuses.push(bonus);

      if (++given == givePerTurn) return;
    }
  }
}

function clearBonuses() {
  for (var i = 0; i < activeBonuses.length; i++) {
    WORLD.remove(activeBonuses[i]);
    BONUSES.slice(i, 1);
  }
}

function removeBonus(index) {
  WORLD.remove(BONUSES[index]);
  BONUSES.slice(index, 1);
}

function rotateBonus() {
  var xAxis = new THREE.Vector3(0,0,1);
  for (var i = 0; i < activeBonuses.length; i++) {
    var bonus = activeBonuses[i];
    bonus.rotateOnAxis( xAxis, Math.PI / 180 );
  }
}

function givePlayerBonus(pIndex, bIndex) {
  PLAYER_BONUSES[pIndex].push(_.clone(BONUS_TYPES[bIndex]));
}