function startBonuses() {
  // Bonuses appear every so often
  bonus();
  setInterval(function() {
    bonus();
  }, 10000);
}

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

var bonusMaterial = new THREE.MeshLambertMaterial({ color: colors['bonus'] }),
    bonusGeometry = new THREE.CubeGeometry(BONUS_SIZE, BONUS_SIZE, BONUS_SIZE, 1, 1, 1);

// Drop a bonus on the board!
function bonus() {
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

        console.log('checking bonus', bonusX, bonusZ);

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
      bonus.position.set(bonusX, bonusY, bonusZ);
      bonus.castShadow = true;
      bonus.shadowDarkness = 0.5;
      WORLD.add(bonus);
      activeBonuses.push(bonus);

      if (++given == givePerTurn) return;
    }
  }
}

function clearBonuses() {
  for (var i = 0; i < activeBonuses.length; i++) {
    WORLD.remove(activeBonuses[i]);
  }
}