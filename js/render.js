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
  scene.add(WORLD);
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

  createStars();
  createSky();
  createWalls();
  createCars();
  createFloor();
  lighting();
  loadObjects();
}

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

  keyEvents(moveDistance, rotateAngle);
  collisions();

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