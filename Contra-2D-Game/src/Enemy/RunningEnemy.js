class RunningEnemy extends Enemy {
    constructor(xAxis, yAxis, collisionBlocks) {
        // Call the constructor of the parent class with the provided arguments
        super(xAxis, yAxis, collisionBlocks);
        // Initializing the health of the enemy to 2
        this.health = ENEMY_RUNNING_HEALTH;
        this.speedLimit = ENEMY_RUNNING_MAX_SPEED;
        // Initializing the actions property (is set later)
        this.actions;
        // Setting the initial direction of the enemy to left
        this.directionLeft = true;
        // Setting the initial velocity of the enemy to 0
        this.velX = 0;
        this.canShoot = false;
        // Setting the initial frame index of the enemy to 0
        this.frameIndex = 0;
        // Setting the initial tick count of the enemy to 0
        this.tickCount = 0;
        // Setting the number of ticks per frame for animation
        this.ticksPerFrame = 4;
        // Setting the number of frames for the running animation to the number of images available
        this.numberOfFrames = runningEnemy.runningLeft.length;
        if (difficulty != DIFFICULTY_EASY) {
            this.health = difficulty == DIFFICULTY_MEDIUM ? (ENEMY_RUNNING_HEALTH + 1) : (ENEMY_RUNNING_HEALTH + 2);
            this.speedLimit = difficulty == DIFFICULTY_MEDIUM ? (ENEMY_RUNNING_MAX_SPEED + 1.5) : (ENEMY_RUNNING_MAX_SPEED + 2);
        }
    }

    draw(ctx) {
        /* --------------------- Used for testing purposed only --------------------- */
        // ctx.strokeStyle = "blue"
        //ctx.strokeRect(this.xAxis, this.yAxis, this.width, this.height)
        /* ----------------------------------- -- ----------------------------------- */
        // Setting the current running action of the enemy to be displayed
        this.actions = runningEnemy.runningLeft[0];
        // Determining the frame set based on the direction of the enemy
        const frameSet = this.directionLeft ? runningEnemy.runningLeft : runningEnemy.runningRight;
        // Drawing the enemy image on the canvas using the appropriate frame of the frame set
        ctx.drawImage(
            this.enemyImage, // Image to be drawn
            frameSet[this.frameIndex].x, // X-coordinate of the frame
            frameSet[this.frameIndex].y, // Y-coordinate of the frame
            frameSet[this.frameIndex].width, // Width of the frame
            frameSet[this.frameIndex].height, // Height of the frame
            this.xAxis, // X-coordinate of the image on the canvas
            this.yAxis, // Y-coordinate of the image on the canvas
            this.width, // Width of the image on the canvas
            this.height // Height of the image on the canvas
        );
    }
    update(player) {
        // Check if the player is colliding with a block
        if (!this.checkInCollisionBlock()) {
            // this.inGround = false;
            // this.moveRight()
            // this.directionLeft = !this.directionLeft;
        }
        // Update the enemy's position on the x-axis and y-axis
        this.xAxis += this.velX;
        this.yAxis += this.velY;
        // Check if the enemy is out of bounds
        this.checkBoundary();
        // Update the enemy's animation
        this.updateAnimation();
        // Check for vertical collisions with other objects
        this.checkVerticalCollisions();
        // Move the enemy left if the direction is left
        if (this.directionLeft) {
            this.moveLeft();
        }
        // Move the enemy right if the direction is right
        if (!this.directionLeft) {
            this.moveRight();
        }
        // Apply gravity if the enemy is not on the ground
        if (!this.inGround) {
            this.useGravity();
        }
        if (difficulty != DIFFICULTY_EASY) {
            this.trackPlayer(player);
        }
    }
    // Updat the animation
    updateAnimation() {
        // Incrementing the tick count
        this.tickCount += 1;
        // Checking if the tick count exceeds the number of ticks per frame
        if (this.tickCount > this.ticksPerFrame) {
            // Reset the tick count
            this.tickCount = 0;
            // Check if the current frame index is not the last frame
            if (this.frameIndex < this.numberOfFrames - 1) {
                // Increment the frame index
                this.frameIndex += 1;
            } else {
                // Reset the frame index to the first frame
                this.frameIndex = 0;
            }
        }
    }
    moveLeft() {
        // Decrease the horizontal velocity of the object by the specified speed
        this.velX -= SPEED;
        // Ensure that the horizontal velocity does not exceed the negative speed limit
        this.velX = Math.max(this.velX, -this.speedLimit);
        // Set the direction of movement to left
        this.directionLeft = true;
    }
    moveRight() {
        // Increase the horizontal velocity of the enemy by the predefined speed
        this.velX += SPEED;
        // Limit the horizontal velocity to the predefined speed limit
        this.velX = this.velX > this.speedLimit ? this.speedLimit : this.velX;
        // Set the current action of the enemy to the first frame of the running right animation
        this.actions = runningEnemy.runningRight[0];
        // Set the direction of the enemy to right
        this.directionLeft = false;
    }
    checkBoundary() {
        // Checking if the enemy's x-axis position is less than 0
        if (this.xAxis < this.collisionBlocks[0].xAxis) {
            // If so, set the x-axis position to 0
            this.xAxis = this.collisionBlocks[0].xAxis;
            // Set the velocity in the x-axis to 0
            this.velX = 0;
            // Move the enemy to the right
            this.moveRight();
        }
        // Checking if the enemy's x-axis position is greater than the canvas width minus the enemy's width
        if (this.xAxis > CANVAS_WIDTH - PLAYER_WIDTH) {
            // If so, set the x-axis position to the canvas width minus the enemy's width
            this.xAxis = CANVAS_WIDTH - PLAYER_WIDTH;
            // Move the enemy to the left
            this.moveLeft();
            // Set the velocity in the x-axis to 0
            this.velX = 0;
        }
        // Checking if the enemy's y-axis position is greater than the canvas height minus the enemy's height
        if (this.yAxis > CANVAS_HEIGHT - PLAYER_HEIGHT) {
            // If so, set the y-axis position to the canvas height minus the enemy's height
            this.yAxis = CANVAS_HEIGHT - PLAYER_HEIGHT;
        }
    }
    trackPlayer(player) {
        // Set the distance threshold
        const distanceThreshold = TILE_SIZE * 3;
        // Check if player is to the left of the current position by distanceThreshold
        if (player.xAxis + distanceThreshold < this.xAxis) {
            // Move the enemy to the left
            this.moveLeft();
        }
        // Check if player is to the right of the current position by distanceThreshold
        if (player.xAxis - distanceThreshold > this.xAxis) {
            // Move the enemy to the right
            this.moveRight();
        }
    }
} 