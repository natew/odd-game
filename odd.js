// Globals
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

init();
animate();

function init() {
  var WIDTH = window.innerWidth - 16,
      HEIGHT = window.innerHeight - 16,
      VIEW_ANGLE = 105,
      ASPECT = WIDTH / HEIGHT,
      NEAR = .1,
      FAR = 10000;

  // Scene / Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 360, 30);
  camera.lookAt(scene.position);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  // Container
  container = document.getElementById('container');
  container.appendChild( renderer.domElement );

  // Events
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

  // Controls


  addLights();
  sphere();
  floor();
}

function floor() {
  var floorMaterial = new THREE.MeshBasicMaterial({ color:0x444444, side:THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
}

function sphere() {
  // set up the sphere vars
  var radius = 50,
      segments = 16,
      rings = 16;

  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry( radius, segments, rings),
    sphereMaterial);

  // set the geometry to dynamic so that it allow updates
  sphere.geometry.dynamic = true;
  sphere.geometry.verticesNeedUpdate = true;
  sphere.geometry.normalsNeedUpdate = true;

  // add the sphere to the scene
  scene.add(sphere);
}

function loadObjects() {
  var loader = new THREE.ObjectLoader;
  loader.load( "car.js", function ( geometry, materials ) {
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xff0000, ambient: 0xff0000 } ) );
    scene.add( mesh );
  });
}

function addLights() {
  // Point light
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  scene.add(pointLight);
}

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

  // if ( keyboard.pressed("A") )
  //   MovingCube.rotation.y += rotateAngle;
  // if ( keyboard.pressed("D") )
  //   MovingCube.rotation.y -= rotateAngle;

  // if ( keyboard.pressed("left") )
  //   MovingCube.position.x -= moveDistance;
  // if ( keyboard.pressed("right") )
  //   MovingCube.position.x += moveDistance;
  // if ( keyboard.pressed("up") )
  //   MovingCube.position.z -= moveDistance;
  // if ( keyboard.pressed("down") )
  //   MovingCube.position.z += moveDistance;

  // // collision detection:
  // //   determines if any of the rays from the cube's origin to each vertex
  // //    intersects any face of a mesh in the array of target meshes
  // //   for increased collision accuracy, add more vertices to the cube;
  // //    for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
  // //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
  // var originPoint = MovingCube.position.clone();

  // clearText();

  // for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
  //   var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
  //   var globalVertex = localVertex.applyMatrix4( MovingCube.matrix );
  //   var directionVector = globalVertex.sub( MovingCube.position );

  //   var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
  //   var collisionResults = ray.intersectObjects( collidableMeshList );
  //   if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
  //     appendText(" Hit ");
  // }

  // controls.update();
  // stats.update();
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function render() {
  renderer.render(scene, camera);
}