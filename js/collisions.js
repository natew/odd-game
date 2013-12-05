function collisions() {
  if (NUM_SHELLS) {
    var i, shell, x, y;
    for (i = 0; i < NUM_SHELLS; i++) {
      shell = SHELLS[i];

      collisionDetect(shell);
      moveShell(shell);

      if (++shell.timeElapsed > SHELL_DURATION) {
        SHELLS.splice(i, 1);
        WORLD.remove(shell);
        NUM_SHELLS--;
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
function collisionDetect(obj) {
  var collisions, i,
      // Maximum distance from the origin before we consider collision
      distance = 32;

  // For each ray
  for (i = 0; i < rays.length; i += 1) {
      // We reset the raycaster to this direction
      caster.set(obj.position, rays[i]);
      // Test if we intersect with any obstacle mesh
      collisions = caster.intersectObjects(WALLS);
      // And disable that direction if we do
      if (collisions.length > 0 && collisions[0].distance <= distance) {

        // Walls
        //         0
        //     __________
        //    |          |
        // 2  |          |  3
        //    |          |
        //     -----------
        //          1

        // console.log('hit wall', i);
        // console.log(WALL_INDEX[collisions[0].object.id]);
        switch(WALL_INDEX[collisions[0].object.id]) {
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
  }
}

function carCollide(obj, ray) {
  var i;
  for (i = 0; i < NUM_CARS; i++) {
    var collisionResults = ray.intersectObject( CARS[i] );

    if (collisionResults.length && obj.fromCar != i) {
      carExplode(i);
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
