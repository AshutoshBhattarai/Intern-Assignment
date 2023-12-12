class Player {
    constructor(xAxis, yAxis, ctx, collisionBLocks) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.ctx = ctx;
        this.velX = 0;
        this.velY = 0;
        this.moving = false;
        this.fall = true;
        this.buttonPressCount = 0;
        this.animationTimer = 0;
        this.inGround = false;
        this.inWater = false;
        this.facing = DIRECTION_RIGHT;
        this.actions = runningRight[0];
        this.collisionBlocks = collisionBLocks;
        this.isSpawning = false;
        this.lives = 3;
        this.playerImage = new Image();
        this.playerImage.src = '../../assets/images/ContraSheet1.gif'
    }

    // This function is responsible for drawing the player on the canvas.
    draw() {
        //? ------------------------ Done for testing purposes ----------------------- */
        // Set the color of the stroke to red.⏬
        //  this.ctx.strokeStyle = 'red';
        //  this.ctx.strokeRect(this.xAxis, this.yAxis, this.width, this.height);
        // Draw a rectangle around the player.☝️
        //? ----------------------------------- -- ----------------------------------- */

        // Draw the player image on the canvas.
        this.ctx.drawImage(
            this.playerImage,   // The image to draw.
            this.actions.x,     // The x coordinate of the image in the sprite sheet.
            this.actions.y,     // The y coordinate of the image in the sprite sheet.
            this.actions.width, // The width of the image in the sprite sheet.
            this.actions.height,// The height of the image in the sprite sheet.
            this.xAxis,         // The x coordinate of the image on the canvas.
            this.yAxis,         // The y coordinate of the image on the canvas.
            this.width,         // The width of the image on the canvas.
            this.height         // The height of the image on the canvas.
        );

    }

    /* ---- Function to reset player's action based on current direction and state(in water or ground) ------ */
    resetActions() {
        this.actions = this.inWater ? (this.facing === DIRECTION_LEFT ? swimming[0] : swimming[4]) : (this.facing === DIRECTION_LEFT ? runningLeft[0] : runningRight[0]);
    }
    // Reset the player size to the default values
    resetPlayerSize() {
        // Set the height of the player to the constant PLAYER_HEIGHT
        this.height = PLAYER_HEIGHT;
        // Set the width of the player to the constant PLAYER_WIDTH
        this.width = PLAYER_WIDTH;
    }
    update() {
        // Apply gravity and reset player size if not in ground or water
        if (!this.inGround && !this.inWater) {
            this.applyGravity();
            this.resetPlayerSize();
        }

        // Check for vertical collisions
        this.checkVerticalCollisions();
        this.checkHorizontalCollisions();

        // Update player position
        this.xAxis += this.velX;
        this.yAxis += this.velY;

        // Handles left movement
        if (inputs.left && !(inputs.down || inputs.up)) {
            this.moveLeft();
        }
        // Handles right movement
        if (inputs.right && !(inputs.down || inputs.up)) {
            this.moveRight();
        }

        // Handles jumping if in ground and not moving up or down
        if (inputs.jump && this.inGround && !(inputs.down || inputs.up)) {
            this.jump();
        }

        // Handles jumping down
        if (inputs.jump && inputs.down) {
            this.jumpDown();
        }
        //Dont let the player shoot in any other direction than left or right when in water
        if (!this.inWater) {
            // Handles aiming up
            if (inputs.up) {
                this.stopMoving();
                this.aimUp();
            }

            // Handles aiming down to the right
            if (inputs.down && inputs.right) {
                this.stopMoving();
                this.aimDown(DIRECTION_RIGHT);
            }

            // Handles aiming down to the left
            if (inputs.down && inputs.left) {
                this.stopMoving();
                this.aimDown(DIRECTION_LEFT);
            }

            // Handles aiming up to the right
            if (inputs.up && inputs.right) {
                this.stopMoving();
                this.aimUp(DIRECTION_RIGHT);
            }

            // Handles aiming up to the left
            if (inputs.up && inputs.left) {
                this.stopMoving();
                this.aimUp(DIRECTION_LEFT);
            }
        }

        // Handles going prone
        if (inputs.down && !(inputs.left || inputs.right)) {
            this.stopMoving();
            this.buttonPressCount++;
            this.goProne();
        }

        // Reset actions and button press count if no inputs
        if (Object.values(inputs).every(value => value === false)) {
            this.animationTimer = 0;
            this.stopMoving();
            this.resetActions();
            this.buttonPressCount = 0;
        }

        // Set inGround to false if not in collision block
        if (!this.checkInCollisionBlock()) {
            this.inGround = false;
        }
    }

    // Stoping the movement of the player
    stopMoving() {
        // Setting the horizontal velocity to 0
        this.velX = 0;
    }
    aimUp(direction) {
        if (direction === undefined) {
            this.actions = this.facing == DIRECTION_RIGHT ? playerTargetUp.right[0] : playerTargetUp.left[0]
        }
        else {
            this.actions = direction == DIRECTION_LEFT ? playerTargetUp.left[1] : playerTargetUp.right[1]
        }
    }
    aimDown(direction) {
        let { left, right } = playerTargetDown;
        this.actions = direction == DIRECTION_LEFT ? left : right;
    }
    playerRunning(direction) {
        // Determining the running direction based on the input direction
        const runningDirection = direction === DIRECTION_RIGHT ? runningRight : runningLeft;
        // Getting the index of the last frame in the running direction animation
        const lastIndex = runningDirection.length - 1;

        // Checking if the animation timer has reached the last frame
        if (this.animationTimer >= lastIndex) {
            // If so, resetting the animation timer to the second frame
            this.animationTimer = 1;
        }

        // Setting the player's actions to the frame specified by the animation timer
        this.actions = runningDirection[this.animationTimer];
    }

    animateMovement() {
        this.buttonPressCount++;
        if (this.buttonPressCount % 7 == 0 && this.buttonPressCount != 0) {
            this.animationTimer += 1;
        }
    }
    moveLeft() {
        // Decrease the horizontal velocity of the player
        this.velX -= SPEED;

        // Animate the movement of the player
        this.animateMovement();

        // Limit the horizontal velocity to a minimum value of -4
        this.velX = this.velX < -4 ? -4 : this.velX;

        // Change the facing direction of the player to left
        this.facing = DIRECTION_LEFT;

        // Check if the player is in water
        if (this.inWater) {
            // Set the player's actions to the swimming animation for left movement
            this.actions = swimming[1];
        } else {
            // Call the playerRunning function to set the player's actions for left movement
            this.playerRunning(DIRECTION_LEFT);
        }
    }
    moveRight() {
        // Increase the horizontal velocity of the player
        this.velX += SPEED;

        // Trigger the animation for movement
        this.animateMovement();

        // Limit the maximum horizontal velocity to 4
        this.velX = Math.min(this.velX, 4);

        // Set the player's facing direction to right
        this.facing = DIRECTION_RIGHT;

        // Check if the player is in water
        if (this.inWater) {
            // Set the player's action to swimming
            this.actions = swimming[3];
        } else {
            // Run the player's running animation for the right direction
            this.playerRunning(DIRECTION_RIGHT);
        }
    }
    applyGravity() {
        // Increasing the vertical velocity of the object by the value of GRAVITY
        this.velY += GRAVITY;
    }
    jump() {
        // Set the vertical velocity (velY) to predefined JUMP_HEIGHT to make the player jump
        this.velY = JUMP_HEIGHT;
        // Set the inGround variable to false to indicate that the object is no longer on the ground
        this.inGround = false;
    }

    jumpDown() {
        this.yAxis =  this.yAxis + 40;
        this.inGround = false;
        return;
    }
    goProne() {
        let { left, right } = playerPronePosition;
        this.yAxis += 40;
        this.height = PLAYER_WIDTH;
        this.width = PLAYER_HEIGHT;
        this.actions = this.facing == DIRECTION_LEFT ? left : right;
    }
    playerHit() {
        this.lives--;
        if (this.lives == 0) {
            console.log("dead");
        }
        this.isSpawning = true;
        setTimeout(() => {
            this.isSpawning = false;
        }, 3000)
    }

    playerReSpawn(x, y) {
        this.resetPlayerSize();
        this.resetActions();
        this.inWater = false;
        this.xAxis = x;
        this.yAxis = y;
    }

    checkBoundary() {
        this.xAxis = Math.max(0, this.xAxis);
        this.yAxis = Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, this.yAxis);
    }
    checkVerticalCollisions() {
        // Loop through each collision block
        for (const block of this.collisionBlocks) {
            // Check if there is a collision between the player and the block
            if (detectBlockCollision(this, block)) {
                // Check if the player is moving downwards
                if (this.velY > 0) {
                    // Check if the block is a platform and the player is not already on the ground
                    if (!this.inGround && block.type === COLLISION_PLATFORM) {
                        // Stop the player's vertical velocity
                        this.velY = 0;
                        // Position the player just above the platform
                        this.yAxis = block.yAxis - this.height - 1;
                        // Reset the player's size
                        this.resetPlayerSize();
                        // Set the player to be on the ground and not in water
                        this.inWater = false;
                        this.inGround = true;
                    }
                    // Check if the block is water
                    else if (block.type === COLLISION_WATER) {
                        // Stop the player's vertical velocity
                        this.velY = 0;
                        // Position the player just above the water
                        this.yAxis = block.yAxis - 1;
                        // Set the player to be in water and not on the ground
                        this.inGround = false;
                        this.inWater = true;
                        // Adjust the player's height to be half of the normal height
                        this.height = PLAYER_HEIGHT / 2;
                        // Start swimming animation
                        let firstSwimmingAnim = setInterval(() => {
                            this.actions = swimming[2];
                        }, 100);
                        // Stop swimming animation after a delay and switch to idle animation
                        setTimeout(() => {
                            clearInterval(firstSwimmingAnim);
                            this.actions = swimming[4];
                        }, 300);
                    }

                    else if (block.type === DEATH_DROP_ID) {
                        console.log("Player Dead");
                        this.playerHit();
                        this.playerReSpawn(0, 0)
                    }
                }
            }
        }
    }
    checkHorizontalCollisions() {
        // Iterate over each collision block
        for (const block of this.collisionBlocks) {
            // Check if there is a collision between this object and the current block
            if (detectBlockCollision(this, block)) {
                // Check if the object is moving to the right and the block is a collision platform
                if (block.type === COLLISION_PLATFORM) {
                    // Check if the object is currently in water and not on the ground
                    if (!this.inGround && this.inWater && block.type === COLLISION_PLATFORM) {
                        // Adjust the object's position to be aligned with the top of the block
                        this.yAxis = block.yAxis - TILE_SIZE;
                        if (this.velX > 0)
                            // Move the object slightly to the right to prevent it from getting stuck in the block
                            this.xAxis = block.xAxis + 1;
                        // Set the object's state to be on the ground and not in water
                        this.inWater = false;
                        this.inGround = true;
                    }
                }
            }
        }
    }


    // Check if the current object is colliding with any of the collision blocks
    checkInCollisionBlock() {
        // Iterate over each collision block
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            // Check if a collision has been detected between the current object and the current collision block
            if (detectBlockCollision(this, this.collisionBlocks[i])) {
                // Return true if a collision has been detected
                return true;
            }
        }
        // Return false if no collision has been detected
        return false;
    }
}

