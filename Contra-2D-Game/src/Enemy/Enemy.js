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
        // Increase the vertical velocity by the value of GRAVITY
        this.velY += GRAVITY;
    }

    checkVerticalCollisions() {
        // Iterate over each collision block
        this.collisionBlocks.forEach((collisionBlock) => {
            // Check if there is a collision between the current block and the enemy
            if (detectBlockCollision(this, collisionBlock)) {
                // Check if the enemy is moving downwards, not already on the ground, and colliding with a platform
                if (this.velY > 0 && !this.inGround && collisionBlock.type === COLLISION_PLATFORM) {
                    // Stop the enemy's vertical velocity
                    this.velY = 0;
                    // Set the enemy's y position just above the collision block
                    this.yAxis = collisionBlock.yAxis - this.height - 1;
                    // Mark the enemy as being on the ground
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