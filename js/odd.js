// Globals
var container, scene, camera, renderer, controls, stats;
var SCREEN_WIDTH, SCREEN_HEIGHT;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var mesh = new THREE.Object3D();

var colors = {
  light: 0xFFFFFF,
  sky: 0x183759,
  wall: 0x420505,
  car: 0xd8d600,
  shell: 0xCC0000
}

var obstacles = [];
var cars = [],
    activeCar = 0,
    shells = [],
    numShells = 0;

var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, wireframe: true, transparent: true } );

var SHELL_SPEED = 20;

init();
animate();

function init() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45,
      ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
      NEAR = .1,
      FAR = 10000;

  // Scene / Camera
  scene = new THREE.Scene();
  scene.add(mesh);
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);

  camera.position.set(0, (SCREEN_HEIGHT + SCREEN_WIDTH) / 2 + 20, 0);
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

  createSky();
  createWalls();
  createCars();
  createFloor();
  lighting();
  loadObjects();
}

function createFloor() {
  var floorMaterial = new THREE.MeshLambertMaterial({ color:0xffffff, side:THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  mesh.add(floor);
}

function createSky() {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshPhongMaterial( { color: colors['sky'], side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  mesh.add(skyBox);
}

function createWalls() {
  var i;
  var wallLengthH = SCREEN_WIDTH,
      wallLengthV = SCREEN_HEIGHT,
      wallPosH = wallLengthH / 2,
      wallPosV = wallLengthV / 2,
      wallWidth = 20,
      wallHeight = 40;

  var wallWidths = [wallLengthH, wallLengthH, wallWidth, wallWidth];
  var wallLengths = [wallWidth, wallWidth, wallLengthV, wallLengthV];
  var wallX = [0, 0, wallPosH, -wallPosH];
  var wallZ = [wallPosV, -wallPosV, 0, 0];

  for (i = 0; i < 4; i++) {
    var wallMaterial = new THREE.MeshPhongMaterial( { color: colors['wall'] } );
    var wall = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(wallWidths[i], wallHeight, wallLengths[i], 1, 1, 1),
        [ wallMaterial, wireframeMaterial ] );
    wall.position.set(wallX[i], wallHeight / 2, wallZ[i]);
    wall.castShadow = true;
    wall.receiveShadow = true;
    obstacles.push(wall);
    mesh.add( wall );
  }
}

var spotLight;
function lighting() {
  // Point light
  spotLight = new THREE.SpotLight(colors['light'], 5.0);
  spotLight.position.set(0, 2000, 0);
  spotLight.castShadow = true;
  // spotLight.shadowCameraVisible = true;
  spotLight.shadowMapWidth = 1024 * 2;
  spotLight.shadowMapHeight = 1024 * 2;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  mesh.add(spotLight);
}

function moveForward(car, moveDistance) {
  car.position.z -= moveDistance;
}

function moveBackward(car, moveDistance) {
  car.position.z += moveDistance;
}

function shoot() {
  var car = cars[activeCar];
  // var degree = Math.abs(car.rotation.y * 180 / Math.PI) % 360;
  var shell = createShell(car.position);
  shell.radians = car.rotation.y + (Math.PI / 2);
  shell.timeElapsed = 0;
  shells.push(shell);
  numShells++;
}

// set up the sphere vars
// var radius = 20, segments = 16, rings = 16;
var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] });
var shellGeometry = new THREE.CubeGeometry(30, 30, 30, 1, 1, 1);

function createShell(position) {
  var shell = new THREE.Mesh( shellGeometry, shellMaterial );
  shell.position.set(position.x, position.y, position.z);
  // shell.geometry.dynamic = true;
  // shell.geometry.verticesNeedUpdate = true;
  // shell.geometry.normalsNeedUpdate = true;
  mesh.add(shell);
  return shell;
}

function createCars() {
  var i;
  for (i = 0; i < 2; i++) {
    var carMaterial = new THREE.MeshPhongMaterial( { color: colors['car'] } );
    var car = THREE.SceneUtils.createMultiMaterialObject(
        new THREE.CubeGeometry(80, 50, 50, 1, 1, 1),
        [ carMaterial, wireframeMaterial ] );
    car.position.set((500 * i) - 250, 25, 0);
    car.castShadow = true;
    car.receiveShadow = true;
    obstacles.push(car);
    mesh.add(car);
    cars.push(car);
  }
}

// Shoot keycode
$(window).keypress(function(e) {
  if (e.keyCode == 32) {
    shoot();
  }
});

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

  if (keyboard.pressed("left"))
    cars[activeCar].rotation.y += rotateAngle;
  if (keyboard.pressed("right"))
    cars[activeCar].rotation.y -= rotateAngle;
  if (keyboard.pressed("up"))
    moveForward(cars[activeCar], moveDistance);
  if (keyboard.pressed("down"))
    moveBackward(cars[activeCar], moveDistance);

  if (numShells) {
    var i, shell, x, y;
    for (i = 0; i < numShells; i++) {
      shell = shells[i];
      dist = SHELL_SPEED;
      x = dist * Math.sin(shell.radians);
      y = dist * Math.cos(shell.radians);

      shell.position.x += x;
      shell.position.z += y;

      collisionDetect(shell);

      if (++shell.timeElapsed > 100) {
        shells.splice(i, 1);
        mesh.remove(shell);
        numShells--;
      }
    }
  }

  controls.update();
  // stats.update();
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function render() {
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.render(scene, camera);
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

var limit = 10;

// function collisionDetect(obj) {
//   var originPoint = obj.position.clone();
//   for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++) {
//     var localVertex = obj.geometry.vertices[vertexIndex].clone();
//     var globalVertex = localVertex.applyMatrix4( obj.matrix );
//     var directionVector = globalVertex.sub( obj.position );

//     var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
//     var collisionResults = ray.intersectObjects( obstacles );
//     if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
//       console.log('hit')
//   }
// }

var collisions,
    i,
    distance = 32,
    rays = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-1, 0, 1)
    ],
    caster = new THREE.Raycaster();

function collisionDetect(obj) {
  // for each ray
  for (i = 0; i < rays.length; i++) {
    // set raycaster position
    if (limit-- > 0) console.log(obj.position);
    caster.set(obj.position, rays[i]);
    // if (i == 0) console.log(caster);
    // debugger;
    collisions = caster.intersectObjects(obstacles);
    if (collisions.length > 0 && collisions[0].distance <= distance) {
      console.log('colllllide')
    }
  }
}


var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disableScroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

disableScroll();