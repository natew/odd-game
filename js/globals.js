// Globals
var container, scene, camera, renderer, controls, stats;
var SCREEN_WIDTH, SCREEN_HEIGHT,
    SCALE_X, SCALE_Y,
    WORLD = new THREE.Object3D(),
    NUM_CARS = 2,
    NUM_SHELLS = 0,
    CAR_SIZE = 40,
    MOVE_SPEED = .05,
    SHELL_SPEED = 8,
    SHELL_DURATION = 300,
    SHELL_SIZE = 15,
    BIG_SHELL_SIZE = 75,
    BANANA_SIZE = 40,
    BONUS_SIZE = 30,
    BONUS_DURATION = 5000,
    DATA = [],
    DATA_PREV = [],
    SCORES = [3, 3],
    PLAYER_BONUSES = [[], []],
    BONUS_TYPES = [],
    INVINCIBLE = [false, false],
    SEEKING_DIFFICULTY = 18;

// Game items
var WALLS = [],
    WALL_INDEX = {},
    CARS = [],
    BONUSES = [],
    SHELLS = [],
    BANANAS = [],
    activeCar = 0,
    SCORE_TEXT = [];

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var colors = {
  light: 0xFFFFFF,
  sky: 0x183759,
  wall: 0xffffff,
  car: 0xd8d600,
  car2: 0x2f70ff,
  shell: 0xCC0000,
  bonus: 0x183759,
  banana: 0xFFFF00
}