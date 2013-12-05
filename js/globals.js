// Globals
var container, scene, camera, renderer, controls;
var SCREEN_WIDTH, SCREEN_HEIGHT,
    WORLD = new THREE.Object3D(),
    NUM_CARS = 2,
    NUM_SHELLS = 0,
    SHELL_SPEED = 8,
    SHELL_DURATION = 300;

// Game items
var WALLS = [],
    CARS = [],
    shells = [],
    activeCar = 0;

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var colors = {
  light: 0xFFFFFF,
  sky: 0x183759,
  wall: 0x420505,
  car: 0xd8d600,
  shell: 0xCC0000
}