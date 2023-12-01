//* Getting the viewport from HTML
const viewport = document.getElementById('viewport');

// Initializing array to store balls;
const ballsArray = [];

//* Setting the viewport height and weight dynamically
viewport.style.height = `${VIEW_HEIGHT}px`;
viewport.style.width = `${VIEW_WIDTH}px`;

console.log(document.body.getBoundingClientRect());

//* Loop for creating ball objects and appending them to the viewport
for (let i = 0; i < BALL_COUNT; i++) {
    //* Generating random sizes for the ball
    const radius = getRandomNumber(10,20);
    //* Generating random colors for the ball
    const color = getRandomColor();
    // Determining height width to use in position generation
    let heightWidth = radius * 2;

    // Generating random position for the ball inside the viewport boundary
    // (-heightWidth prevents them from going outside the viewport)
    const randomX = getRandomNumber(0, VIEW_WIDTH - heightWidth);
    const randomY = getRandomNumber(0, VIEW_HEIGHT - heightWidth);
    let ball = new Ball(randomX, randomY, radius, color);

    ballsArray.push(ball);
    viewport.appendChild(ball.getElement());
}

//Function to render the ball
function render() {
    ballsArray.forEach((ball) => {
        //Draws the ball
        ball.draw();
        //Moves the ball
        ball.move();
        //checks for ball collision
        // checks the value of a ball with all other balls in the array
        ball.checkBallCollision(ballsArray);
        // Checks boundary collision
        ball.checkWallCollision()
    })
    requestAnimationFrame(render)
}
render()

