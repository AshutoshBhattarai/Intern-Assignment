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
        this.playerImage = new Image();
        this.playerImage.src = '../../assets/images/ContraSheet1.gif'
    }

    draw() {
        this.ctx.strokeStyle = 'red';
        this.ctx.drawImage(this.playerImage,
            this.actions.x,
            this.actions.y,
            this.actions.width,
            this.actions.height,
            this.xAxis,
            this.yAxis,
            this.width,
            this.height);
        this.ctx.strokeRect(this.xAxis, this.yAxis, this.width, this.height);
    }

    resetActions() {
        this.actions = this.inWater ? (this.facing === DIRECTION_LEFT ? swimming[0] : swimming[4]) : (this.facing === DIRECTION_LEFT ? runningLeft[0] : runningRight[0]);
    }
    resetPlayerSize() {
        this.height = PLAYER_HEIGHT;
        this.width = PLAYER_WIDTH;
    }
    update() {
        // Apply gravity and reset player width and height if not in ground or water
        if (!this.inGround && !this.inWater) {
            this.applyGravity();
            this.resetPlayerSize();
        }
        // Check for vertical collisions
        this.checkVerticalCollisions();

        // Update x and y positions
        this.xAxis += this.velX;
        this.yAxis += this.velY;

        //* ------------------------ Left and right movements ------------------------ */
        // Move left if left key is pressed and not also pressing up or down
        if (inputs.left && !(inputs.down || inputs.up)) {
            this.moveLeft();
        }

        // Move right if right key is pressed and not also pressing up or down
        if (inputs.right && !(inputs.down || inputs.up)) {
            this.moveRight();
        }
        //* ----------------------------------- -- ----------------------------------- */

        //* ----------------------------- Jump movements ----------------------------- */
        // Jump if jump key is pressed and player is on the ground and not pressing down
        if (inputs.jump && this.inGround && !(inputs.down || inputs.up)) {
            this.jump();
        }

        // Jump down if jump key and down key are pressed
        if (inputs.jump && inputs.down) {
            this.jumpDown();
        }
        //* ----------------------------------- -- ----------------------------------- */

        //* ------------------------------ Aim Movements ----------------------------- */
        if (inputs.up) {
            console.log("Aiming up");
            this.aimUp();
        }

        // Stop moving if down key and right key are pressed
        if (inputs.down && inputs.right) {
            this.stopMoving();
            this.aimDown(DIRECTION_RIGHT)

        }
        // Stop moving if down key and left key are pressed
        if (inputs.down && inputs.left) {
            this.stopMoving();
            this.aimDown(DIRECTION_LEFT)
        }

        // Stop moving if up key and right key are pressed
        if (inputs.up && inputs.right) {
            this.stopMoving();
            this.aimUp(DIRECTION_RIGHT);
        }

        // Stop moving if up key and left key are pressed
        if (inputs.up && inputs.left) {
            this.stopMoving();
            this.aimUp(DIRECTION_LEFT);
        }
        //* ----------------------------------- -- ----------------------------------- */

        // Log "Sleep" if down key is pressed and not pressing left or right
        if (inputs.down && !(inputs.left || inputs.right)) {
            this.stopMoving();
            this.buttonPressCount++;
            this.goProne();
        }

        //* -------------------------- No movement detection ------------------------- */
        // Reset animation timer, stop moving, and reset actions if no inputs
        if (Object.values(inputs).every(value => value === false)) {
            this.animationTimer = 0;
            this.stopMoving();
            this.resetActions();
            this.buttonPressCount = 0;
        }
        //* ----------------------------------- -- ----------------------------------- */
        // Reset inGround if not in collision
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
        this.velX -= SPEED;
        this.animateMovement();
        this.velX = this.velX < -4 ? -4 : this.velX;
        this.facing = DIRECTION_LEFT;
        if (this.inWater) {
            this.actions = swimming[1];
        }
        else {
            this.playerRunning(DIRECTION_LEFT);
        }
    }
    moveRight() {
        this.velX += SPEED;
        this.animateMovement();
        this.velX = Math.min(this.velX, 4);
        this.facing = DIRECTION_RIGHT;
        if (this.inWater) {
            this.actions = swimming[3];
        } else {
            this.playerRunning(DIRECTION_RIGHT);
        }
    }
    applyGravity() {
        this.velY += GRAVITY;
    }

    jump() {
        this.velY = -20;
        this.inGround = false;
    }

    jumpDown() {

        console.log("Drop Down");
    }
    goProne() {
        let { left, right } = playerPronePosition;
        this.height = PLAYER_WIDTH;
        this.width = PLAYER_HEIGHT;
        this.actions = this.facing == DIRECTION_LEFT ? left : right;
    }

    checkBoundary() {
        this.xAxis = Math.max(0, this.xAxis);
        this.yAxis = Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, this.yAxis);
    }
    checkVerticalCollisions() {
        this.collisionBlocks.forEach((block) => {
            if (detectCollision(this, block)) {
                if (this.velY > 0 && (!this.inGround || this.inWater) && block.type === COLLISION_PLATFORM) {
                    this.velY = 0;
                    this.yAxis = block.yAxis - this.height - 1;
                    this.resetPlayerSize();
                    this.inWater = false;
                    this.inGround = true;
                } else if (this.velY > 0 && block.type === COLLISION_WATER) {
                    this.velY = 0;
                    this.yAxis = block.yAxis - 1;
                    this.inGround = false;
                    this.inWater = true;
                    this.height = PLAYER_HEIGHT / 2;
                    let firstSwimmingAnim = setInterval(() => {
                        this.actions = swimming[2];
                    }, 100);
                    setTimeout(() => {
                        clearInterval(firstSwimmingAnim);
                        this.actions = swimming[4];
                    }, 300);
                }
            }
        });
    }


    checkInCollisionBlock() {
        return this.collisionBlocks.some((block) =>
            detectCollision(this, block)
        );
    }
}

