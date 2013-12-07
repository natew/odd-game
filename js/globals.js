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
    SCORES = [5, 5],
    PLAYER_BONUSES = [[], []],
    BONUS_TYPES = [],
    INVINCIBLE = [false, false],
    INVINCIBLE_DURATION = 1000 * 7,
    SEEKING_DIFFICULTY = 18,
    PARTICLES = [],
    INTRO_LENGTH = 2.5, // seconds
    DO_INTRO = false,
    GAME_OVER = false,
    BONUS_INTERVAL,
    MAX_BONUS_PER_CYCLE = 5;

// Game items
var WALLS = [],
    WALL_INDEX = {},
    CARS = [],
    BONUSES = [],
    SHELLS = [],
    BANANAS = [],
    activeCar = 0,
    SCORE_TEXT = [],
    CAR_PARTICLES = [],
    OBJECTS = {};

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var colors = {
  light: 0xFFFFFF,
  sky: 0x183759,
  wall: 0xffffff,
  car: 0xd8d600,
  car2: 0x1b4299,
  shell: 0xCC0000,
  bonus: 0x7393ff,
  banana: 0xFFFF00
}