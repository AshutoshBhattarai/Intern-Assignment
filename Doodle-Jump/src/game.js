/* -------------------------------------------------------------------------- */
/*                                 Game Logics                                */
/* -------------------------------------------------------------------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* ------------------------- Defining Game Variables ------------------------ */
let doodler;
let platform;
let platformArray = [];
let score = 0;
let background = new Image();
let platformSpeed = 2;


function init() {
    score = 0;
    platformArray = [];

    background.src = "./assets/images/bg.png";
    background.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    let doodlerX = canvas.width / 2 - DOODLER_WIDTH / 2;
    let doodlerY = canvas.height * 3 / 4 - DOODLER_HEIGHT;

    doodler = new Player(doodlerX, doodlerY, DOODLER_WIDTH, DOODLER_HEIGHT);

    let platformX = doodlerX + (DOODLER_WIDTH / 2) - (PLATFORM_WIDTH / 2);
    let platformY = doodlerY + DOODLER_HEIGHT;

    platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    platformArray.push(platform);

    generatePlatfrom(platformY);
}

function render() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    doodler.draw(ctx);

    platformArray.forEach(platform => {
        platform.draw(ctx);
        if (detectCollision(platform, doodler)) {
            doodler.inPlatform = true;
        }

        if (doodler.yAxis < canvas.height * 3 / 4) {
            platform.yAxis += platformSpeed;
        }
    });

    doodler.move();

    doodler.checkOutofBounds(canvas.width);

    if (platformArray[0].yAxis > canvas.height) {

        if (score % 500 == 0 && score >= 500) {
            platformSpeed += 0.5;
        }

        score += 10;

        platformArray.shift();

        let lastPlatform = platformArray[platformArray.length - 1].yAxis;
        if (doodler.yAxis >= doodler.height) {
            generateNewPlatform(lastPlatform);
        }

    }

    displayScore();
    checkGameOver();

    const animationFrame = requestAnimationFrame(render);
    if (checkGameOver()) {
        cancelAnimationFrame(animationFrame);
        displayGameOver();
    }
}

function generatePlatfrom(platformY) {
    for (let i = 0; i < 10; i++) {
        let platformX = getRandomNumber(0, canvas.width - PLATFORM_WIDTH);
        platformY -= 60
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }

}

function generateNewPlatform(platformY) {
    for (let i = 0; i < 6; i++) {
        let platformX = getRandomNumber(0 + PLATFORM_WIDTH / 2, canvas.width - PLATFORM_WIDTH);
        platformY -= getRandomNumber(60, 80)
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }
}

function checkGameOver() {
    return doodler.yAxis > canvas.height;
}


function displayScore() {
    ctx.font = "20px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 30);
}


function startGame() {
    init();
    render();
}


