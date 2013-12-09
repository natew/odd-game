var sounds = {
    "player_1": {
        "pickup": [
            "./assets/audio/mk64/mk64_mario08.wav",
            "./assets/audio/mk64/mk64_mario01.wav",
            "./assets/audio/mk64/mk64_mario03.wav"
        ],
        "made_shot": [
            "./assets/audio/mk64/mk64_mario01.wav",
            "./assets/audio/mk64/mk64_mario07.wav",
            "./assets/audio/mk64/mk64_mario10.wav"
        ],
        "got_shot": [
            "./assets/audio/mk64/mk64_mario06.wav",
            "./assets/audio/mk64/mk64_mario04.wav",
            "./assets/audio/mk64/mk64_mario05.wav"
        ]
    },
    "player_2": {
        "pickup": [
            "./assets/audio/mk64/mk64_luigi06.wav",
            "./assets/audio/mk64/mk64_luigi01.wav"
        ],
        "made_shot": [
            "./assets/audio/mk64/mk64_luigi01.wav",
            "./assets/audio/mk64/mk64_luigi07.wav",
            "./assets/audio/mk64/mk64_luigi02.wav"
        ],
        "got_shot": [
            "./assets/audio/mk64/mk64_luigi04.wav",
            "./assets/audio/mk64/mk64_luigi04.wav"
        ]
    },
    "general": {
        "game_start": [
            "./assets/audio/mk64/mk64_racestart.wav",
            "./assets/audio/mk64/mk64_multiplayerstart.wav"
        ],
        "count_down": [
            "./assets/audio/mk64/mk64_countdown.wav"
        ],
        "shoot": [
            "./assets/audio/mk64/shot.wav"
        ],
        "banana": [
            "./assets/audio/mk64/mk64_item_drop.wav"
        ],
        "game_over" : [
          "./assets/audio/mk64/mk64_firstplace.wav",
          "./assets/audio/mk64/mk64_announcer11-jp.wav",
          "./assets/audio/mk64/mk64_mario_a11.wav",
        ]
    }
};

function playSound(name, player) {
  var snd;

  if (typeof(player) == "number") {
    if (player === 0) {
      player = "player_1";
    }
    else if (player === 1) {
      player = "player_2";
    }
  }

  if (player) {
    var randVal = Math.floor(Math.random() * (sounds[player][name].length));
    snd = new Audio(sounds[player][name][randVal]); // buffers automatically when created
  }
  else {
    var randVal = Math.floor(Math.random() * (sounds['general'][name].length));
    snd = new Audio(sounds['general'][name][randVal]); // buffers automatically when created
  }
  snd.play();
}

