function keyEvents(moveDistance, rotateAngle) {
  if (keyboard.pressed("left"))
    CARS[activeCar].rotation.y += rotateAngle;
  if (keyboard.pressed("right"))
    CARS[activeCar].rotation.y -= rotateAngle;
  if (keyboard.pressed("up"))
    moveForward(CARS[activeCar], moveDistance);
  if (keyboard.pressed("down"))
    moveBackward(CARS[activeCar], moveDistance);
}


// Shoot keycode
$(window).keypress(function(e) {
  console.log(e.keyCode);
  if (e.keyCode == 49) {
    activeCar = 0;
    playerAction(0);
  }
  else if (e.keyCode == 50) {
    activeCar = 1;
    playerAction(1);
  }
});