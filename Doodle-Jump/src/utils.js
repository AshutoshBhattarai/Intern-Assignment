
function getRandomNumber(min, max) {
  return min + Math.random() * (max - min);
}


/**
 * 
 * @param {Player} rect1 
 * @param {Platform} rect2 
 * @returns 
 */
function detectCollision(rect1, rect2) {
  return (
    rect1.xAxis < rect2.xAxis + rect2.width &&
    rect1.xAxis + rect1.width > rect2.xAxis &&
    rect1.yAxis < rect2.yAxis + rect2.height &&
    rect1.yAxis + rect1.height > rect2.yAxis
  );
}