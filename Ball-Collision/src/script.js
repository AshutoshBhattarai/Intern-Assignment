const viewport = document.getElementById('viewport');
const ballArray = [];
viewport.style.height = `${VIEW_HEIGHT}px`;
viewport.style.width = `${VIEW_WIDTH}px`;
for (let i = 0; i < BALL_COUNT; i++) {
    const radius = 5//getRandomNumber(10,20);
    const color = getRandomColor();
    let heightWidth = radius * 2;
    const randomX = getRandomNumber(0, VIEW_WIDTH - heightWidth);
    const randomY = getRandomNumber(0, VIEW_HEIGHT - heightWidth);
    let ball = new Ball(randomX, randomY, radius, color);
    //console.log(getRandomColor);
    ballArray.push(ball);
    viewport.appendChild(ball.getElement());
}

function render() {
    // console.log("Calling Render fn");
    ballArray.forEach((ball) => {
        ball.draw();
        ball.move();


        ballArray.forEach((otherBall) => {
            if (ball === otherBall) {
                return;
            }
            if (calcDistance(ball.xAxis, ball.yAxis, otherBall.xAxis, otherBall.yAxis) < ball.radius + otherBall.radius) {
                ball.checkBallCollision();
                otherBall.checkBallCollision();
            }
        })
        ball.checkWallCollision()
    })
    requestAnimationFrame(render)
}
requestAnimationFrame(render)

