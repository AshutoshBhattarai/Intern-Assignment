/* ---------------------- Platform Collision Detection ---------------------- */
function detectBlockCollision(rect1, rect2) {
  return (
    rect1.xAxis < rect2.xAxis + rect2.width &&
    rect1.xAxis + rect1.width > rect2.xAxis &&
    rect1.yAxis < rect2.yAxis &&
    rect1.yAxis + rect1.height > rect2.yAxis
  );
}

/* ---------------------- Normal Rectangle Collision Detection ---------------------- */
function detectRectCollision(rect1, rect2) {
  return (
    rect1.xAxis < rect2.xAxis + rect2.width &&
    rect1.xAxis + rect1.width > rect2.xAxis &&
    rect1.yAxis < rect2.yAxis + rect2.height &&
    rect1.yAxis + rect1.height > rect2.yAxis
  );
}

/* ---------------------- Random Number Generator ---------------------- */
function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
/* ---------------------- Create Audio Object and Play ---------------------- */
function playAudio(audioPath) {
  audio = new Audio(audioPath);
  audio.play();
}

//! -------------------------- Stop audio (Not Used) ------------------------- */
function stopAudio() {
  audio.pause();
}