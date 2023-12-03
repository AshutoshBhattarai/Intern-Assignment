class Player {
    constructor(xAxis, yAxis, width, height) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.inPlatform = false;
        //Initially the player faces left
        this.facing = {
            left: true,
            right: false
        }
    }

    draw(ctx) {
        //Drawing the player and the position its facing
        if (this.facing.left) {
            let player = new Image();
            player.src = './assets/images/doodle-left.png'
            ctx.drawImage(player, this.xAxis, this.yAxis, this.width, this.height);
        }
        else {
            let player = new Image();
            player.src = './assets/images/doodle-right.png'
            ctx.drawImage(player, this.xAxis, this.yAxis, this.width, this.height);
        }
    }

    move() {
        //Left, right and jump movement
        this.xAxis += this.velocityX;
        this.yAxis += this.velocityY;

        //Changing player movement on the basis of keyboard input

        if (inputs.left || inputs.right) {
            // If the player is moving left decrease the velocityX by speed
            //Else increase the velocityX by speed
            this.velocityX = inputs.left ? -SPEED : SPEED;
            //Same as above but changes the facing direction values
            this.facing.left = inputs.left ? true : false;
            this.facing.right = inputs.right ? true : false;
        }
        else {
            this.velocityX = 0
        }

        //If in platform remove gravity effect and go up or JUMP
        // When the player leaves the ground set inPlatform to false
        if (this.inPlatform) {
            this.velocityY = 0;
            this.velocityY = INITIAL_VELOCITY_Y;
            this.inPlatform = false;
        }
        //IF the player is falling increase the gravity
        else {
            this.velocityY += GRAVITY;
        }
    }

    // Checks if the doodler is out of the frame and draws on the other side
    checkOutofBounds(canvasWidth) {
        if (this.xAxis + this.width / 2 > canvasWidth) {
            this.xAxis = 0;
        }
        if (this.xAxis < -this.width / 2) {
            this.xAxis = canvasWidth - this.width;
        }
    }
}