var sounds = {
    "player_1": {
        "pickup": [
            "./assets/audio/mk64/mk64_mario08.wav"
        ],
        "made_shot": [
            "./assets/audio/mk64/mk64_mario01.wav"
        ],
        "got_shot": [
            "./assets/audio/mk64/mk64_mario06.wav"
        ]
    },
    "player_2": {
        "pickup": [
            "./assets/audio/mk64/mk64_luigi06.wav"
        ],
        "made_shot": [
            "./assets/audio/mk64/mk64_luigi01.wav"
        ],
        "got_shot": [
            "./assets/audio/mk64/mk64_luigi04.wav"
        ]
    },
    "general": {
        "game_start": [
            "./assets/audio/mk64/mk64_racestart.wav"
        ],
        "count_down": [
            "./assets/audio/mk64/mk64_countdown.wav"
        ],
        "shoot": [
            "./assets/audio/mk64/shot.wav"
        ],
        "banana": [
            "./assets/audio/mk64/mk64_item_drop.wav"
        ]
    }
};

function playSound(name, player) {
  var snd;

  if (player) {
    snd = new Audio(sounds[player][name]); // buffers automatically when created
  }
  else {
    snd = new Audio(sounds['general'][name][0]); // buffers automatically when created
  }
  snd.play();
}

//playSound('made_shot', 'player_1');

//playSound('shoot');

//playSound('banana');

