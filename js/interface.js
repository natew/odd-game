var group, text, i;

// Init
for (i = 0; i < 2; i++) {
  var group = createScore(i, SCORES[i]);
  WORLD.add( group );
  SCORE_TEXT.push( group );
}

function createScore(index, write) {
  var theText = write;
  var hash = document.location.hash.substr( 1 );
  if ( hash.length !== 0 ) {
    theText = hash;
  }

  var text3d = new THREE.TextGeometry( theText, {
    size: 50,
    height: 20,
    curveSegments: 2,
    weight: 'normal',
    font: "gamegirl classic"
  });

  text3d.computeBoundingBox();
  // text3d.computeVertexNormals();
  var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

  var textMaterial = new THREE.MeshLambertMaterial( { color: 0xff36d5, overdraw: true } );
  text = new THREE.Mesh( text3d, textMaterial );

  if (i == 0)
    text.position.x = -SCREEN_WIDTH / 2 + centerOffset + 135;
  else
    text.position.x = SCREEN_WIDTH / 2 - centerOffset - 200;

  text.position.y = 100;
  text.position.z = SCREEN_HEIGHT / 2 - 100;

  text.rotation.x = -Math.PI / 2;
  text.rotation.y = Math.PI * 2;

  group = new THREE.Object3D();
  group.add( text );

  return group;
}

function updateScore(index, score) {
  WORLD.remove(SCORE_TEXT[index]);
  var score = createScore(index, score);
  WORLD.add( score );
  SCORE_TEXT[index] = score;
}