function collisions() {
  if (NUM_SHELLS) {
    var i, shell, x, y;
    for (i = 0; i < NUM_SHELLS; i++) {
      shell = SHELLS[i];

      collisionDetect(shell, i);
      moveShell(shell);

      if (++shell.timeElapsed > SHELL_DURATION) {
        removeShell(i);
      }
    }
  }
}

var rays = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-1, 0, 0)
    ],
    caster = new THREE.Raycaster();

// Detect collishs
function collisionDetect(obj, index) {
  var collisions, i,
      distance = SHELL_SIZE; // Maximum distance from origin to collide

  // For each ray
  for (i = 0; i < rays.length; i += 1) {
    // We reset the raycaster to this direction
    caster.set(obj.position, rays[i]);

    // WALL = BOUNCE
    // Test if we intersect with any obstacle mesh
    var wall_collisions = caster.intersectObjects(WALLS);
    if (wall_collisions.length > 0 && wall_collisions[0].distance <= distance) {
      wallBounce(obj, wall_collisions[0].object.id);
    }

    // CAR = EXPLODE
    carCollide(obj, caster, index);
  }
}

// Walls
//         0
//     __________
//    |          |
// 2  |          |  3
//    |          |
//     -----------
//          1
function wallBounce(obj, wall_id) {
  switch(WALL_INDEX[wall_id]) {
    // Left and right
    case 0:
    case 2:
      var bounceRad = Math.PI - obj.radians;
      if (bounceRad < 0) {
        bounceRad += Math.PI * 2;
      }
      obj.radians = bounceRad;
      break;

    // Top and bottom
    case 3:
    case 1:
      var bounceRad = 2 * Math.PI - obj.radians;
      obj.radians = bounceRad;
      break;
  }
}

function carCollide(obj, caster, shellIndex) {
  var i, distance = CAR_SIZE / 2; // Distance from center of car to collide
  for (i = 0; i < NUM_CARS; i++) {
    var car_collisions = caster.intersectObject( CARS[i] );

    if (car_collisions.length && car_collisions[0].distance <= distance && obj.fromCar != i) {
      carExplode(i);
      removeShell(shellIndex);
    }
  }
}

function wallCollide(obj, ray) {
  // Loop through walls
  var i;
  for (i = 0; i < 4; i++) {
    var collisionResults = ray.intersectObject( WALLS[i] );
    // if ( collisionResults.length > 0) console.log(collisionResults[0].distance);
    // if ( collisionResults.length > 0) console.log(obj.geometry.vertices.length);
    if (collisionResults.length) {

      // Walls
      //         1
      //     __________
      //    |          |
      // 0  |          |  2
      //    |          |
      //     -----------
      //          3

      // console.log('hit wall', i);
      switch(i) {
        // Left and right
        case 0:
        case 2:
          var bounceRad = Math.PI - obj.radians;
          if (bounceRad < 0) {
            bounceRad += Math.PI * 2;
          }
          obj.radians = bounceRad;
          break;

        // Top and bottom
        case 3:
        case 1:
          var bounceRad = 2 * Math.PI - obj.radians;
          obj.radians = bounceRad;
          break;
      }

      // Do an extra move just to prevent weird collisions
      moveShell(obj);
      return true;
    }
  }

  return false;
}
