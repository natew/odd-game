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

var walls = [];
var cars = [],
    activeCar = 0,
    shells = [],
    numShells = 0;

var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, wireframe: true, transparent: true } );

var SHELL_SPEED = 15,
    SHELL_DURATION = 300;

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

  camera.position.set(0, (SCREEN_HEIGHT + SCREEN_WIDTH) / 1.9, 0);
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
  var wall;

  for (i = 0; i < 4; i++) {
    wall = new THREE.Mesh(
        new THREE.CubeGeometry(wallWidths[i], wallHeight, wallLengths[i], 1, 1, 1),
        new THREE.MeshPhongMaterial( { color: colors['wall'] } )
      );
    wall.position.set(wallX[i], wallHeight / 2, wallZ[i]);
    wall.castShadow = true;
    wall.receiveShadow = true;
    walls.push(wall);
    mesh.add( wall );
  }

  // Swap walls into nice order this is CRAP
  var b = walls[3];
  walls[3] = walls[0];
  walls[0] = b;
}

var spotLight;
function lighting() {
  // Point light
  spotLight = new THREE.SpotLight(colors['light'], 5.0);
  spotLight.position.set(0, 1500, 0);
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
  var shell = createShell(car);

  shell.radians = (car.rotation.y) % (Math.PI * 2);
  if (shell.radians < 0) shell.radians += Math.PI * 2;
  // console.log(shell.radians * 180 / Math.PI);

  shell.timeElapsed = 0;
  shells.push(shell);
  numShells++;
}

// set up the sphere vars
// var radius = 20, segments = 16, rings = 16;
var shellMaterial = new THREE.MeshLambertMaterial({ color: colors['shell'] });
var shellGeometry = new THREE.CubeGeometry(30, 30, 30, 1, 1, 1);

function createShell(car) {
  var shell = new THREE.Mesh( shellGeometry, shellMaterial ),
      carAngle = car.rotation.y + (Math.PI / 2),
      shellX = 80 * Math.sin(carAngle),
      shellZ = 80 * Math.cos(carAngle);

  shell.position.set(car.position.x + shellX, car.position.y, car.position.z + shellZ);
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
    var car = new THREE.Mesh(
      new THREE.CubeGeometry(80, 50, 50, 1, 1, 1),
      carMaterial );
    var half_screen = SCREEN_WIDTH / 2;
    car.position.set((half_screen * i) - (half_screen/2), 25, 0);
    car.castShadow = true;
    car.receiveShadow = true;
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

var show_radians = false;

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

      collisionDetect(shell);
      moveShell(shell);

      // if (++shell.timeElapsed > SHELL_DURATION) {
      //   shells.splice(i, 1);
      //   mesh.remove(shell);
      //   numShells--;
      // }
    }
  }

  controls.update();
  // stats.update();
}

// 25 x, 18 y

var SCALE_X = SCREEN_WIDTH / 25 / 2,
    SCALE_Y = SCREEN_HEIGHT / 18 / 2;

function moveCar(index, x, y) {
  console.log(x * SCALE_X);
  cars[index].position.x = x * SCALE_X;
  cars[index].position.z = - (y * SCALE_Y);
}

function moveShell(shell) {
  dist = SHELL_SPEED;
  if (show_radians) console.log(shell.radians);
  x = dist * Math.cos(shell.radians);
  y = (dist * Math.sin(shell.radians)) * -1;

  shell.position.x += x;
  shell.position.z += y;
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

    // Loop through walls
    var i;
    for (i = 0; i < 4; i++) {
      var collisionResults = ray.intersectObject( walls[i] );
      if ( collisionResults.length > 0) console.log(collisionResults[0].distance);
      if ( collisionResults.length > 0) console.log(obj.geometry.vertices.length);
      if ( collisionResults.length > 0 && (collisionResults[0].distance) < 40 && collisionResults[0].distance > 20) {

        // Walls
        //         1
        //     __________
        //    |          |
        // 0  |          |  2
        //    |          |
        //     -----------
        //          3

        // console.log('hit wall', i);
        // console.log('current deg', obj.radians * 180 / Math.PI);
        // console.log('bounce deg', bounceRad * 180 / Math.PI);

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
  }
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

// disable scroll
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

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});