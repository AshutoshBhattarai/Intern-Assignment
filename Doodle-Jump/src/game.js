/* -------------------------------------------------------------------------- */
/*                                 Game Logics                                */
/* -------------------------------------------------------------------------- */
// All the game logic are defined here

// Getting Canvas element from the HTML DOM
const canvas = document.getElementById('canvas');
// Getting 2D context to render 2D Objects in canvas element
const ctx = canvas.getContext('2d');

/* ------------------------- Defining Game Variables ------------------------ */
let doodler;
let platform;
let platformArray = [];
let score = 0;
let background = new Image();
let platformSpeed = 2;


//Initialization function for the game
// It will be called only once which initializes the game variables and other logics
function init() {
    score = 0;
    platformArray = [];

    // Getting background image from assets folder
    background.src = "./assets/images/bg.png";
    // Drawing the image on the canvas
    background.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    // Initial doodler starting point
    let doodlerX = canvas.width / 2 - DOODLER_WIDTH / 2;
    let doodlerY = canvas.height * 3 / 4 - DOODLER_HEIGHT;
    // Creating our doodler(Player) object with initital values
    // X-axis, Y-axis and doodler's width and height
    doodler = new Player(doodlerX, doodlerY, DOODLER_WIDTH, DOODLER_HEIGHT);

    // Initial platform starting point
    // Starting the initial platform where the doodler is
    let platformX = doodlerX + (DOODLER_WIDTH / 2) - (PLATFORM_WIDTH / 2);
    let platformY = doodlerY + DOODLER_HEIGHT;
    // Creating the platform object and pushing it into the platformArray
    platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    platformArray.push(platform);
    //Generating initial set of platforms for the doodler to jump
    generatePlatfrom(platformY);
}

/* ------------------------ Function Render the Game ------------------------ */
function render() {
    // Clearing the canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //Drawing the doodler
    doodler.draw(ctx);

    // Drawing the platforms
    platformArray.forEach(platform => {
        // Draws the platform
        platform.draw(ctx);
        //Detects if the doodler is in the platform or not
        if (detectCollision(platform, doodler)) {
            doodler.inPlatform = true;
        }
        //Moves the platform down when doodler reaches certain height
        // Creates an illusion that the doodler is going up
        if (doodler.yAxis < canvas.height * 3 / 4) {
            platform.yAxis += platformSpeed;
        }
    });
    //Moving the doodler(left, right or jumping)
    doodler.move();

    // Check if the doodler is out of the left and right border
    doodler.checkOutofBounds(canvas.width);

    //If the initial platform is out of the frame this generates new platform
    if (platformArray[0].yAxis > canvas.height) {

        //Increases platform moving speed every 500 score increase
        if (score % 500 == 0 && score >= 500) {
            platformSpeed += 0.5;
        }
        //Adds score on every platform generated
        score += 10;
        //Removes the first(0) element from the array and shifts the array(1 becomes 0)
        platformArray.shift()
        // Get the last platform position
        let lastPlatform = platformArray[platformArray.length - 1].yAxis;
        // Prevents doodler from infinitely Going Up while the platforms spawns above it
        if (doodler.yAxis <= doodler.height) {
            // console.log("Stop Generating Map");
        }
        else { generateNewPlatform(lastPlatform); }

    }

    //Displays the score on every frame refresh
    displayScore();
    // Continuously check if the game is over
    checkGameOver();

    // Continuously call the render function
    const animationFrame = requestAnimationFrame(render);
    if (checkGameOver()) {
        cancelAnimationFrame(animationFrame);
        displayGameOver();
    }
}

//Generating initial set of platforms
function generatePlatfrom(platformY) {
    for (let i = 0; i < 10; i++) {
        let platformX = getRandomNumber(0, canvas.width - PLATFORM_WIDTH);
        platformY -= 60
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }

}

//Generating new platforms
function generateNewPlatform(platformY) {
    for (let i = 0; i < 6; i++) {
        let platformX = getRandomNumber(0 + PLATFORM_WIDTH / 2, canvas.width - PLATFORM_WIDTH);
        platformY -= getRandomNumber(60, 80)
        platform = new Platform(platformX, platformY, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        platformArray.push(platform);
    }
}

//If doodler goes below our canvas width. Game Over!
function checkGameOver() {
    return doodler.yAxis > canvas.height ? true : false;
}


//Displays the score
function displayScore() {
    ctx.font = "20px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 30);
}


//Function to start the game 
function startGame() {
    init();
    render();
}


