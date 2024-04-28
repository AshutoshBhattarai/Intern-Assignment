class RunningEnemy extends Enemy {
    constructor(xAxis, yAxis, collisionBlocks) {
        super(xAxis, yAxis, collisionBlocks);
        this.health = ENEMY_RUNNING_HEALTH;
        this.speedLimit = ENEMY_RUNNING_MAX_SPEED;
        this.actions;
        this.directionLeft = true;
        this.velX = 0;
        this.canShoot = false;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 4;
        this.numberOfFrames = runningEnemy.runningLeft.length;
        if (difficulty != DIFFICULTY_EASY) {
            this.health = difficulty == DIFFICULTY_MEDIUM ? (ENEMY_RUNNING_HEALTH + 1) : (ENEMY_RUNNING_HEALTH + 2);
            this.speedLimit = difficulty == DIFFICULTY_MEDIUM ? (ENEMY_RUNNING_MAX_SPEED + 1.5) : (ENEMY_RUNNING_MAX_SPEED + 2);
        }
    }

    draw(ctx) {
        this.actions = runningEnemy.runningLeft[0];
        const frameSet = this.directionLeft ? runningEnemy.runningLeft : runningEnemy.runningRight;

        ctx.drawImage(
            this.enemyImage,
            frameSet[this.frameIndex].x,
            frameSet[this.frameIndex].y,
            frameSet[this.frameIndex].width,
            frameSet[this.frameIndex].height,
            this.xAxis,
            this.yAxis,
            this.width,
            this.height
        );
    }
    update(player) {
        if (!this.checkInCollisionBlock()) {
            // this.inGround = false;
            // this.moveRight()
            // this.directionLeft = !this.directionLeft;
        }
        this.xAxis += this.velX;
        this.yAxis += this.velY;
        this.checkBoundary();
        this.updateAnimation();
        this.checkVerticalCollisions();
        if (this.directionLeft) {
            this.moveLeft();
        }

        if (!this.directionLeft) {
            this.moveRight();
        }

        if (!this.inGround) {
            this.useGravity();
        }

        if (difficulty != DIFFICULTY_EASY) {
            this.trackPlayer(player);
        }
    }
    updateAnimation() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex += 1;
            }

            else {
                this.frameIndex = 0;
            }
        }
    }
    moveLeft() {
        this.velX -= SPEED;
        this.velX = Math.max(this.velX, -this.speedLimit);
        this.directionLeft = true;
    }
    moveRight() {
        this.velX += SPEED;
        this.velX = this.velX > this.speedLimit ? this.speedLimit : this.velX;
        this.actions = runningEnemy.runningRight[0];
        this.directionLeft = false;
    }
    checkBoundary() {
        if (this.xAxis < this.collisionBlocks[0].xAxis) {
            this.xAxis = this.collisionBlocks[0].xAxis;
            this.velX = 0;
            this.moveRight();
        }
        if (this.xAxis > CANVAS_WIDTH - PLAYER_WIDTH) {
            this.xAxis = CANVAS_WIDTH - PLAYER_WIDTH;
            this.moveLeft();
            this.velX = 0;
        }
        if (this.yAxis > CANVAS_HEIGHT - PLAYER_HEIGHT) {
            this.yAxis = CANVAS_HEIGHT - PLAYER_HEIGHT;
        }
    }
    trackPlayer(player) {
        const distanceThreshold = TILE_SIZE * 3;
        if (player.xAxis + distanceThreshold < this.xAxis) {
            this.moveLeft();
        }

        if (player.xAxis - distanceThreshold > this.xAxis) {
            this.moveRight();
        }
    }
} 