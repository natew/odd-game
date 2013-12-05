function collisions() {
  if (NUM_SHELLS) {
    var i, shell, x, y;
    for (i = 0; i < NUM_SHELLS; i++) {
      shell = shells[i];

      collisionDetect(shell);
      moveShell(shell);

      // if (++shell.timeElapsed > SHELL_DURATION) {
      //   shells.splice(i, 1);
      //   mesh.remove(shell);
      //   NUM_SHELLS--;
      // }
    }
  }
}

// Detect collishs
function collisionDetect(obj) {
  var originPoint = obj.position.clone();
  // if (!obj.geometry) return;

  // Loop through vertices
  for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++) {
    var localVertex = obj.geometry.vertices[vertexIndex].clone();

    var globalVertex = localVertex.applyMatrix4( obj.matrix );
    var directionVector = globalVertex.sub( obj.position );

    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

    if (wallCollide(obj, ray)) break;
    else if (carCollide(obj, ray)) break;
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
