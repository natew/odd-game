// Globals
var container, scene, camera, renderer, controls, stats;
var SCREEN_WIDTH, SCREEN_HEIGHT,
    SCALE_X, SCALE_Y,
    WORLD = new THREE.Object3D(),
    NUM_CARS = 2,
    NUM_SHELLS = 0,
    CAR_SIZE = 40,
    SHELL_SPEED = 8,
    SHELL_DURATION = 300,
    SHELL_SIZE = 15,
    BONUS_SIZE = 30,
    DATA = [],
    DATA_PREV = [],
    SCORES = [3, 3],
    PLAYER_BONUSES = [[], []],
    BONUS_TYPES = [],
    INVINCIBLE = [false, false];

// Game items
var WALLS = [],
    WALL_INDEX = {},
    CARS = [],
    BONUSES = [],
    SHELLS = [],
    activeCar = 0,
    SCORE_TEXT = [];

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var colors = {
  light: 0xFFFFFF,
  sky: 0x183759,
  wall: 0xffffff,
  car: 0xd8d600,
  shell: 0xCC0000,
  bonus: 0x183759
}