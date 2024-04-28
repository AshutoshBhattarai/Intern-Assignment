class Enemy {
    constructor(xAxis, yAxis, collisionBlocks) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.velY = 0;
        this.canShoot = true;
        this.inGround = false;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.collisionBlocks = collisionBlocks;
        this.enemyImage = new Image();
        this.enemyImage.src = "./assets/images/Enemies.gif";
    }
    draw(ctx) {
    }

    update() {
    }

    useGravity() {
        this.velY += GRAVITY;
    }

    checkVerticalCollisions() {
        this.collisionBlocks.forEach((collisionBlock) => {
            if (detectBlockCollision(this, collisionBlock)) {
                if (this.velY > 0 && !this.inGround && collisionBlock.type === COLLISION_PLATFORM) {
                    this.velY = 0;
                    this.yAxis = collisionBlock.yAxis - this.height - 1;
                    this.inGround = true;
                }
            }
        });
    }
    checkInCollisionBlock() {
        for (const element of this.collisionBlocks) {
            if (detectBlockCollision(this, element)) {
                return true;
            }
        }
        return false;
    }

}