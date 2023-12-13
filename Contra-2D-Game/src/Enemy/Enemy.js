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
        this.collisionBlocks.forEach((collisionBlocks) => {
            if (detectBlockCollision(this, collisionBlocks)) {
                if (this.velY > 0 && !this.inGround && collisionBlocks.type == COLLISION_PLATFORM) {
                    this.velY = 0;
                    this.yAxis = collisionBlocks.yAxis - this.height - 1;
                    this.inGround = true;
                }
            }
        });
    }
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