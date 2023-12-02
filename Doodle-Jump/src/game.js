const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let doodler;
let platform;
let platformArray = [];
let gameOver = false;
let score = 0;



let background = new Image();
background.src = "./assets/images/bg.png";
background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function init() {
    let doodlerWidth = 50;
    let doodlerHeight = 50;
    let doodlerX = canvas.width / 2 - doodlerWidth / 2;
    let doodlerY = canvas.height * 3 / 4 - doodlerHeight;
    doodler = new Player(doodlerX, doodlerY, doodlerWidth, doodlerHeight);
    let platformX = doodlerX + (doodlerWidth / 2) - (PLATFORM_WIDTH / 2);
    let platformY = doodlerY + doodlerHeight;
    platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    platformArray.push(platform);
    generatePlatfrom(platformY);
}
init();
function render() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    doodler.draw(ctx);

    platformArray.forEach(platform => {
        if (detectCollision(doodler, platform)) {
            doodler.inPlatform = true;
        }

        platform.draw(ctx);
        if (doodler.yAxis < canvas.height * 2 / 4) {
            platform.yAxis += 2;
        }
    });
    doodler.move();
    doodler.checkOutofBounds(canvas.width);
    if (platformArray[0].yAxis > canvas.height) {
        score += 10;
        console.log(score);
        platformArray.shift()
        let lastPlatform = platformArray[platformArray.length - 1].yAxis;
        console.log("Last Platform", lastPlatform);
        // Prevents doodler from infinitely Going Up while the platforms spawns above it
        if (doodler.yAxis <= doodler.height) {
            // console.log("Stop Generating Map");
        }
        else { generateNewPlatform(lastPlatform); }

    }
    displayScore();
    checkGameOver();
    const animationFrame = requestAnimationFrame(render);
    if (gameOver) {

        cancelAnimationFrame(animationFrame);

    }
}

render();
function generatePlatfrom(platformY) {
    for (let i = 0; i < 3; i++) {
        let platformX = getRandomNumber(0 + PLATFORM_WIDTH / 2, canvas.width - PLATFORM_WIDTH);
        platformY -= 100
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }

}

function generateNewPlatform(platformY) {
    for (let i = 0; i < 6; i++) {
        let platformX = getRandomNumber(0 + PLATFORM_WIDTH / 2, canvas.width - PLATFORM_WIDTH);
        platformY -= getRandomNumber(100, 150)
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }
}

function checkGameOver() {
    if (doodler.yAxis > canvas.height) {
        gameOver = true;
        alert("Game Over");
        window.location.reload();
    }
    else {
        gameOver = false;
    }
}

function displayScore() {
    ctx.font = "20px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 30);
}


