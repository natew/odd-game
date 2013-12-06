function keyEvents(moveDistance, rotateAngle) {

  // left player
  if (keyboard.pressed("a"))
    CARS[0].rotation.y += rotateAngle;
  if (keyboard.pressed("d"))
    CARS[0].rotation.y -= rotateAngle;
  if (keyboard.pressed("w"))
    moveForward(CARS[0], moveDistance);
  if (keyboard.pressed("s"))
    moveBackward(CARS[0], moveDistance);

  // right player
  if (keyboard.pressed("left"))
    CARS[1].rotation.y += rotateAngle;
  if (keyboard.pressed("right"))
    CARS[1].rotation.y -= rotateAngle;
  if (keyboard.pressed("up"))
    moveForward(CARS[1], moveDistance);
  if (keyboard.pressed("down"))
    moveBackward(CARS[1], moveDistance);
}


// Shoot keycode
$(window).keypress(function(e) {
  console.log(e.keyCode);
  if (e.keyCode == 32) { // space
    playerAction(0);
  }
  else if (e.keyCode == 13) { // right enter
    playerAction(1);
  }
});