init();
animate();

function init() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  SCALE_X = SCREEN_WIDTH / 25 / 2;
  SCALE_Y = SCREEN_HEIGHT / 18 / 2;

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

  // Stats
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  createStars();
  createSky();
  createFloor();
  createWalls();
  createCars();
  lighting();
  initInterface();

  setTimeout(function() {
    startBonuses();
  }, DO_INTRO ? INTRO_LENGTH * 1000 + 1000 : 0);

  if (DO_INTRO) {
    setTimeout(function () {
      doIntro();
    }, 500);
  }
}

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta * 2; // pi/2 radians (90 degrees) per second
  var time = clock.getElapsedTime();

  if (!GAME_OVER) {
    // Disable keys until intro over
    if (DO_INTRO && time > INTRO_LENGTH || !DO_INTRO) {
      keyEvents(moveDistance, rotateAngle);
    }

    moveCar();
    collisions();
    moveShells();
    rotateBonus();
    fadeBonus(delta);
    controls.update();
    stats.update();
    particleAnimate(time);
  }
}

function animate() {
  setTimeout(function() {
    requestAnimationFrame(animate);
    update();
    render();
  }, 1000 / 100);
}

function render() {
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.render(scene, camera);
}
