var group, text, i;

// Init
function initInterface() {
  for (i = 0; i < 2; i++) {
    var group = createScore(i, SCORES[i]);
    camera.add( group );
    SCORE_TEXT.push( group );
  }
}

function createScore(index, write) {
  var theText = write;
  var hash = document.location.hash.substr( 1 );
  if ( hash.length !== 0 ) {
    theText = hash;
  }

  var text3d = new THREE.TextGeometry( theText, {
    size: 40,
    height: 10,
    curveSegments: 2,
    weight: 'normal',
    font: "gamegirl classic"
  });

  text3d.computeBoundingBox();
  // text3d.computeVertexNormals();
  var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

  var textMaterial = new THREE.MeshLambertMaterial( { color: 0xff36d5, overdraw: true } );
  text = new THREE.Mesh( text3d, textMaterial );

  if (index == 0)
    text.position.x = -230;
  else
    text.position.x = 180;

  text.position.y = -120;
  text.position.z = -400;

  text.rotation.y = Math.PI * 2;

  group = new THREE.Object3D();
  group.add( text );

  return group;
}

function updateScore(index, score) {
  camera.remove(SCORE_TEXT[index]);
  var score = createScore(index, score);
  camera.add( score );
  SCORE_TEXT[index] = score;
}

var activeBanner;
function showBanner(text) {
  removeBanner();

  var hash = document.location.hash.substr( 1 );
  if ( hash.length !== 0 ) text = hash;

  var text3d = new THREE.TextGeometry( text, {
    size: 40,
    height: 10,
    curveSegments: 2,
    weight: 'normal',
    font: "gamegirl classic"
  });

  text3d.computeBoundingBox();
  // text3d.computeVertexNormals();
  var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

  var textMaterial = new THREE.MeshLambertMaterial( { color: 0xff36d5, overdraw: true } );
  text = new THREE.Mesh( text3d, textMaterial );

  text.rotation.y = Math.PI * 2;
  text.position.z = -300;
  text.position.x += centerOffset;

  activeBanner = text;
  camera.add(text);
}

function removeBanner() {
  if (activeBanner) camera.remove(activeBanner);
}