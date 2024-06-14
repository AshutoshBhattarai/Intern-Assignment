class Player {
    constructor(xAxis, yAxis, ctx, collisionBLocks) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.ctx = ctx;
        this.velX = 0;
        this.velY = 0;
        this.isJumping = false;
        this.buttonPressCount = 0;
        this.animationTimer = 0;
        this.inGround = false;
        this.inWater = false;
        this.hasSpecialBullet = false;
        this.specialBulletCount = 0;
        this.isFacing = DIRECTION_RIGHT;
        this.respawnFlicker = 0;
        this.actions = runningRight[0];
        this.collisionBlocks = collisionBLocks;
        this.isSpawning = false;
        this.lives = difficulty == DIFFICULTY_EASY ? PLAYER_LIVES : (difficulty == DIFFICULTY_MEDIUM ? (PLAYER_LIVES - 1) : (PLAYER_LIVES - 2));
        this.playerImage = new Image();
        this.playerImage.src = './assets/images/ContraSheet1.gif'
    }

    draw() {

        if (this.isSpawning) {
            if (this.respawnFlicker % 3 === 0) {
                this.ctx.globalAlpha = 0; // Set alpha to 0 to make the player invisible
            } else {
                this.ctx.globalAlpha = 1; // Set alpha to 1 to make the player visible
            }

            this.respawnFlicker++;
        }
        this.ctx.drawImage(
            this.playerImage,
            this.actions.x,
            this.actions.y,
            this.actions.width,
            this.actions.height,
            this.xAxis,
            this.yAxis,
            this.width,
            this.height
        );


        //Reset the global alpha to make player visible
        this.ctx.globalAlpha = 1;
    }

    /* ---- Function to reset player's action based on current direction and state(in water or ground) ------ */
    resetActions() {
        if (this.inWater) {
            this.actions = this.isFacing === DIRECTION_LEFT ? swimming[0] : swimming[4];
        }
        else {

            this.actions = this.isFacing === DIRECTION_LEFT ? runningLeft[0] : runningRight[0];
        }
    }


    resetPlayerSize() {
        this.height = PLAYER_HEIGHT;
        this.width = PLAYER_WIDTH;
    }
    update() {
        if (!this.inGround && !this.inWater) {
            this.applyGravity();
        }
        if (!this.inGround && !this.inWater && !this.isJumping) {
            this.resetPlayerSize();
        }

        this.checkVerticalCollisions();
        this.checkHorizontalCollisions();

        this.xAxis += this.velX;
        this.yAxis += this.velY;

        if (inputs.left && !(inputs.down || inputs.up)) {
            this.moveLeft();
        }

        if (inputs.right && !(inputs.down || inputs.up)) {
            this.moveRight();
        }

        if (inputs.jump && this.inGround && !(inputs.down || inputs.up)) {
            this.jump();
        }

        if (inputs.jump && inputs.down) {
            this.jumpDown();
        }


        if (!this.inWater) {
            if (inputs.up) {
                this.stopMoving();
                this.aimUp();
            }

            if (inputs.down && inputs.right) {
                this.stopMoving();
                this.aimDown(DIRECTION_RIGHT);
            }

            if (inputs.down && inputs.left) {
                this.stopMoving();
                this.aimDown(DIRECTION_LEFT);
            }

            if (inputs.up && inputs.right) {
                this.stopMoving();
                this.aimUp(DIRECTION_RIGHT);
            }

            if (inputs.up && inputs.left) {
                this.stopMoving();
                this.aimUp(DIRECTION_LEFT);
            }
        }

        if (!this.isJumping && inputs.down && !(inputs.left || inputs.right)) {
            this.stopMoving();
            this.goProne();
        }

        if (Object.values(inputs).every(value => value === false)) {
            this.animationTimer = 0;
            this.buttonPressCount = 0;
            this.stopMoving();
            if (!this.isJumping) this.resetActions();
        }

        if (!this.checkInCollisionBlock()) {
            this.inGround = false;
        }
        if (this.specialBulletCount <= 0) {
            this.hasSpecialBullet = false;
        }
    }

    stopMoving() {
        this.velX = 0;
    }


    aimUp(direction) {
        if (direction === undefined) {
            this.actions = this.isFacing == DIRECTION_RIGHT ? playerTargetUp.right[0] : playerTargetUp.left[0]
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
        const runningDirection = direction === DIRECTION_RIGHT ? runningRight : runningLeft;
        const lastIndex = runningDirection.length - 1;

        if (this.animationTimer >= lastIndex) {
            this.animationTimer = 1;
        }

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

        this.isFacing = DIRECTION_LEFT;

        if (this.inWater) {
            this.actions = swimming[1];
        } else {
            if (!inputs.jump && !this.isJumping) {
                this.playerRunning(DIRECTION_LEFT);
            }
        }
    }
    moveRight() {
        this.velX += SPEED;
        if (!inputs.jump && !this.isJumping) {
            this.animateMovement();
        }

        // Limit the maximum horizontal velocity to 4
        this.velX = Math.min(this.velX, 4);

        this.isFacing = DIRECTION_RIGHT;

        if (this.inWater) {
            this.actions = swimming[3];
        } else if (!inputs.jump && !this.isJumping) {
            this.playerRunning(DIRECTION_RIGHT);
        }
    }
    applyGravity() {
        this.velY += GRAVITY;
    }

    jump() {
        this.isJumping = true;
        this.inGround = false;
        if (this.isJumping) {
            this.height = TILE_SIZE;
            this.width = TILE_SIZE;
            this.animateJump();
        }


        this.velY = JUMP_HEIGHT;
    }
    animateJump() {
        let jumpFrame = 0;
        this.actions = jumpingSprite[jumpFrame];
        const jumpAnimationInterval = setInterval(() => {
            if (!this.isJumping) {
                clearInterval(jumpAnimationInterval);
                this.resetActions();
            }
            else {
                jumpFrame++;
                if (jumpFrame >= jumpingSprite.length - 1) {
                    jumpFrame = 0;
                }
                else this.actions = jumpingSprite[jumpFrame];
            }
        }, 50);
    }
    jumpDown() {
        // Todo
    }

    goProne() {
        let { left, right } = playerPronePosition;
        this.yAxis += 40;
        this.height = PLAYER_WIDTH;
        this.width = PLAYER_HEIGHT;

        this.actions = this.isFacing == DIRECTION_LEFT ? left : right;
    }

    playerHit() {
        this.lives--;
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

    isDead() {
        return this.lives <= 0;
    }

    checkBoundary() {
        this.xAxis = Math.max(0, this.xAxis);
        this.yAxis = Math.min(CANVAS_HEIGHT - PLAYER_HEIGHT, this.yAxis);
    }

    checkVerticalCollisions() {
        for (const block of this.collisionBlocks) {
            if (detectBlockCollision(this, block)) {
                if (this.velY > 0) {
                    if (!this.inGround && block.type === COLLISION_PLATFORM) {
                        this.velY = 0;

                        this.resetPlayerSize();

                        this.yAxis = block.yAxis - this.height - 1;

                        this.inGround = true;
                        this.inWater = false;
                        this.isJumping = false;
                    }

                    else if (block.type === COLLISION_WATER) {
                        this.velY = 0;
                        this.yAxis = block.yAxis - 1;

                        this.isJumping = false;
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

                    else if (block.type === DEATH_DROP_ID) {
                        this.playerHit();
                        this.playerReSpawn(0, 0)
                    }
                }
            }
        }
    }
    checkHorizontalCollisions() {
        for (const block of this.collisionBlocks) {
            if (detectBlockCollision(this, block)) {
                if (block.type === COLLISION_PLATFORM) {
                    if (!this.inGround && this.inWater) {
                        this.yAxis = block.yAxis - TILE_SIZE;
                        if (this.velX > 0)
                            this.xAxis = block.xAxis + 1;
                        this.inWater = false;
                        this.inGround = true;
                    }
                }
            }
        }
    }


    // Check if the player is colliding with any of the collision blocks
    checkInCollisionBlock() {
        for (const element of this.collisionBlocks) {
            if (detectBlockCollision(this, element)) {
                return true;
            }
        }
        return false;
    }
}

