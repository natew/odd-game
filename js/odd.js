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

//set up particles
var particleCount = 100,
    particleGeometry = new THREE.Geometry(),
    particleMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 20,
      map: THREE.ImageUtils.loadTexture(
          "/images/blue_particle.jpg"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

var walls = [];
var cars = [],
    activeCar = 0,
    shells = [],
    numShells = 0;

var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, wireframe: true, transparent: true } );

var NUM_CARS = 2,
    SHELL_SPEED = 8,
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

  // Particles
  for ( i = 0; i < particleCount; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 1000 - 500;
    vertex.y = Math.random() * 1000 - 500;
    vertex.z = Math.random() * 1000 - 500;
    particleGeometry.vertices.push( vertex );
  }

  particles = new THREE.ParticleSystem( particleGeometry, particleMaterial );
  mesh.add(particles);

  createSky();
  createWalls();
  createCars();
  createFloor();
  lighting();
  loadObjects();
}

function createFloor() {
  var floorMaterial = new THREE.MeshPhongMaterial({ color:0xffffff, transparent:true, opacity:0.5 });
  var floorGeometry = new THREE.PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  mesh.add(floor);
}

function createSky() {
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshLambertMaterial( { color: colors['sky'], side: THREE.BackSide } );
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
  shell.fromCar = car.index;
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
    car.index = i;
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

function moveCar(index, x, y, theta) {
  // console.log(x * SCALE_X);
  cars[index].position.x = x * SCALE_X;
  cars[index].position.z = - (y * SCALE_Y);
  cars[index].rotation.y = theta;
}

function moveShell(shell) {
  dist = SHELL_SPEED;
  // if (show_radians) console.log(shell.radians);
  x = dist * Math.cos(shell.radians);
  y = (dist * Math.sin(shell.radians)) * -1;

  shell.position.x += x;
  shell.position.z += y;
}

function carExplode(index) {
  var car = cars[index];
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
    var collisionResults = ray.intersectObject( cars[i] );

    if (collisionResults.length && obj.fromCar != i) {
      carExplode(i);
    }
  }
}

function wallCollide(obj, ray) {
  // Loop through walls
  var i;
  for (i = 0; i < 4; i++) {
    var collisionResults = ray.intersectObject( walls[i] );
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

var socket = io.connect('http://localhost:9001');
socket.on('messages', function (data) {
  console.log(data);
  moveCar(0, data.x, data.y, data.theta);
});