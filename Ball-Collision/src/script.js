const viewport = document.getElementById('viewport');

const ballsArray = [];

viewport.style.height = `${VIEW_HEIGHT}px`;
viewport.style.width = `${VIEW_WIDTH}px`;

console.log(document.body.getBoundingClientRect());

for (let i = 0; i < BALL_COUNT; i++) {
    //* Generating random sizes for the ball
    const radius = getRandomNumber(10, 20);
    //* Generating random colors for the ball
    const color = getRandomColor();
    let heightWidth = radius * 2;

    // Generating random position for the ball inside the viewport boundary
    // (-heightWidth prevents them from going outside the viewport)
    const randomX = getRandomNumber(0, VIEW_WIDTH - heightWidth);
    const randomY = getRandomNumber(0, VIEW_HEIGHT - heightWidth);
    let ball = new Ball(randomX, randomY, radius, color);

    ballsArray.push(ball);
    viewport.appendChild(ball.getElement());
}

function render() {
    ballsArray.forEach((ball) => {
        ball.draw();
        ball.move();
        ball.checkBallCollision(ballsArray);
        ball.checkWallCollision()
    })
    requestAnimationFrame(render)
}
render()

