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
  if (e.keyCode == 32) {
    shoot();
  }
});