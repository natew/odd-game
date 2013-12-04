// Globals
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var collidableMeshList = [];
var cars = [],
    activeCar = 0;

var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
var multiMaterial = [ darkMaterial, wireframeMaterial ];

init();
animate();

function init() {
  var SCREEN_WIDTH = window.innerWidth - 16,
      SCREEN_HEIGHT = window.innerHeight - 16,
      VIEW_ANGLE = 45,
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = .1,
      FAR = 10000;

  // Scene / Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 1500, 30);
  camera.lookAt(scene.position);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  // Container
  container = document.getElementById('container');
  container.appendChild( renderer.domElement );

  // Events
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });

  // Controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  sky();
  lighting();
  walls();
  renderCars();
  floor();
  loadObjects();
}

function floor() {
  var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  var floorMaterial = new THREE.MeshBasicMaterial({ map:floorTexture, side:THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
}

function sky() {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x59b6ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  scene.add(skyBox);
}

function walls() {
  var i;
  var wallWidth = [1000, 1000, 50, 50];
  var wallLength = [50, 50, 1000, 1000];
  var wallX = [0, 0, 500, -500];
  var wallZ = [500, -500, 0, 0];

  for (i = 0; i < 4; i++) {

    var wall = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(wallWidth[i], 20, wallLength[i], 1, 5, 1),
        multiMaterial );
    wall.position.set(wallX[i], 10, wallZ[i]);
    scene.add( wall );
  }
}

function renderCars() {
  var i;
  for (i = 0; i < 2; i++) {
    var car = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(80, 50, 50, 1, 1, 1),
        multiMaterial );
    car.position.set(100 * i, 25, 0);
    scene.add(car);
    cars.push(car);
  }
}

function loadObjects() {
  // var loader = new THREE.ObjectLoader;
  // loader.load( "models/car.json", function ( geometry, materials ) {
  //   var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xff0000, ambient: 0xff0000 } ) );
  //   scene.add( mesh );
  // });

  // var loader = new THREE.ColladaLoader();
  // loader.load('models/civic-red.dae', function (result) {
  //   result.scene.dynamic = true;
  //   result.scene.verticesNeedUpdate = true;
  //   result.scene.normalsNeedUpdate = true;
  //   scene.add(result.scene);
  // });
}

function lighting() {
  // Point light
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 400;
  pointLight.position.z = 330;
  scene.add(pointLight);
}

function moveForward(car, moveDistance) {
  car.position.z += moveDistance;
}

function moveBackward(car, moveDistance) {
  car.position.z -= moveDistance;
}

function shoot() {
  var car = cars[activeCar];

  var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360,
      dist = 10,
      x = dist * Math.sin(degree),
      y = dist * Math.cos(degree);

  var shell = createShell(car.position);
}

// set up the sphere vars
var radius = 50, segments = 16, rings = 16;
var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);

function createShell(position) {
  var mesh = new THREE.Mesh( sphereGeometry, sphereMaterial )
  mesh.position.set(position.x, position.y, position.z);
  mesh.geometry.dynamic = true;
  mesh.geometry.verticesNeedUpdate = true;
  mesh.geometry.normalsNeedUpdate = true;
  scene.add(mesh);
}

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

  if ( keyboard.pressed("space") )
    shoot();

  if ( keyboard.pressed("left") )
    cars[activeCar].rotation.y += rotateAngle;
  if ( keyboard.pressed("right") )
    cars[activeCar].rotation.y -= rotateAngle;
  if ( keyboard.pressed("up") )
    moveForward(cars[activeCar], moveDistance);
  if ( keyboard.pressed("down") )
    moveBackward(cars[activeCar], moveDistance);

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

  controls.update();
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