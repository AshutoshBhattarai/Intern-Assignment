class SoldierEnemy extends Enemy {
    constructor(xAxis, yAxis, collisionBlocks) {
        super(xAxis, yAxis, collisionBlocks);
        this.health = ENEMY_SOLDIER_HEALTH;
        this.actions = gunEnemy.left;
        this.bullets = [];
        this.lastBullet = 0;
        this.bulletCount = 0;
        this.bulletLimit = ENEMY_SOLDIER_BULLET_LIMIT;
        if (difficulty != DIFFICULTY_EASY) {
            this.health = difficulty == DIFFICULTY_MEDIUM ? (ENEMY_SOLDIER_HEALTH + 1) : (ENEMY_SOLDIER_HEALTH + 2);
            this.bulletLimit = (ENEMY_SOLDIER_BULLET_LIMIT + 1);
        }
    }

    draw(ctx) {
        /* ------------------------ Used for testing purposes ----------------------- */
        // ctx.strokeStyle = "green"
        // ctx.strokeRect(this.xAxis, this.yAxis, this.width, this.height);
        /* ----------------------------------- -- ----------------------------------- */
        const { x, y, width, height } = this.actions;
        ctx.drawImage(this.enemyImage, x, y, width, height, this.xAxis, this.yAxis, this.width, this.height);
    }
    update() {
        // Update the y-axis position by adding the vertical velocity
        this.yAxis += this.velY;
        // Check for any vertical collisions
        this.checkVerticalCollisions();
        // If the enemy is not in the ground, apply gravity
        if (!this.inGround) {
            this.useGravity();
        }
    }
    shoot(player) {
        const direction = this.getEnemyShootingDirection(player);
        // Get the current time
        const currentTime = Date.now();
        // Check if enough time has passed since the enemy last shot a bullet
        const canShoot = currentTime - this.lastBullet > BULLET_COOLDOWN;
        // Set the origin of the bullet to the enemy soldier
        const from = ENEMY_SOLDIER;
        // If enough time has passed, determine the position and direction of the bullet based on the given direction
        if (canShoot) {
            // Adjusted position for bullet to come out of the enemy's gun
            let bulletX, bulletY, bulletDirection;
            if (direction === DIRECTION_LEFT) {
                bulletX = this.xAxis;
                bulletY = this.yAxis + this.height / 3;
                bulletDirection = DIRECTION_LEFT;
            } else if (direction === DIRECTION_RIGHT) {
                bulletX = this.xAxis + PLAYER_WIDTH;
                bulletY = this.yAxis + this.height / 3;
                bulletDirection = DIRECTION_RIGHT;
            } else if (direction === DIRECTION_UP) {
                bulletX = this.xAxis + this.width / 2;
                bulletY = this.yAxis;
                bulletDirection = DIRECTION_UP;
            } else if (direction === DIRECTION_UP_LEFT) {
                bulletX = this.xAxis;
                bulletY = this.yAxis;
                bulletDirection = DIRECTION_UP_LEFT;
            } else if (direction === DIRECTION_UP_RIGHT) {
                bulletX = this.xAxis + this.width;
                bulletY = this.yAxis;
                bulletDirection = DIRECTION_UP_RIGHT;
            } else if (direction === DIRECTION_DOWN_LEFT) {
                bulletX = this.xAxis;
                bulletY = this.yAxis + this.height / 2;
                bulletDirection = DIRECTION_DOWN_LEFT;
            } else if (direction === DIRECTION_DOWN_RIGHT) {
                bulletX = this.xAxis + this.width;
                bulletY = this.yAxis + this.height / 2;
                bulletDirection = DIRECTION_DOWN_RIGHT;
            }
            if (bulletDirection) {
                this.shootBullet(bulletX, bulletY, bulletDirection);
                this.lastBullet = currentTime;
            }
        }
    }
    // This function is responsible for shooting a bullet from the player's position in a given direction.

    shootBullet(x, y, direction) {
        // Check if there are no bullets currently on the screen and the bulletCount is equal to the bulletLimit.
        if (this.bullets.length === 0 && this.bulletCount === this.bulletLimit) {
            // If so, reset the bulletCount to 0.
            this.bulletCount = 0;
        }

        // Create a new Bullet object with the provided position, direction, and bullet type.
        const bullet = new Bullet(x, y, direction, ENEMY_SOLDIER, false, this.bullets);

        // Check if the bulletCount is less than the bulletLimit.
        if (this.bulletCount < this.bulletLimit) {
            playAudio(gameAudios.enemyShooting);
            // If so, increment the bulletCount by 1.
            this.bulletCount++;
            // Push the bullet object into the bullets array.
            this.bullets.push(bullet);
        }
    }



    getEnemyShootingDirection(player) {
        // Extract the x and y coordinates of the player
        const { xAxis, yAxis } = player;
        // Extract the x and y coordinates of the enemy and assign it to enemyXAxis and enemyYAxis
        const { xAxis: enemyXAxis, yAxis: enemyYAxis } = this;
        // Calculate if the player is to the left or right of the enemy by a certain distance
        const isPlayerToLeft = xAxis < enemyXAxis - (PLAYER_WIDTH + 20);
        const isPlayerToRight = xAxis > enemyXAxis + (PLAYER_WIDTH + 20);
        // Calculate if the player is above or below the enemy
        const isPlayerAbove = yAxis < enemyYAxis - PLAYER_HEIGHT;
        const isPlayerBelow = yAxis > enemyYAxis + PLAYER_HEIGHT;
        // Determine the shooting direction based on the positions of the player and enemy
        if (isPlayerToLeft && isPlayerAbove) {
            // Set the enemy's actions to shoot up and to the left
            this.actions = gunEnemy.upLeft;
            // Return the direction  for up-left
            return DIRECTION_UP_LEFT;
        } else if (isPlayerToRight && isPlayerAbove) {
            this.actions = gunEnemy.upRight;
            return DIRECTION_UP_RIGHT;
        } else if (isPlayerToRight && isPlayerBelow) {
            this.actions = gunEnemy.downRight;
            return DIRECTION_DOWN_RIGHT;
        } else if (isPlayerToLeft && isPlayerBelow) {
            this.actions = gunEnemy.downLeft;
            return DIRECTION_DOWN_LEFT;
        } else if (isPlayerToLeft) {
            this.actions = gunEnemy.left;
            return DIRECTION_LEFT;
        } else if (isPlayerAbove) {
            this.actions = gunEnemy.up;
            return DIRECTION_UP;
        } else if (isPlayerToRight) {
            this.actions = gunEnemy.right;
            return DIRECTION_RIGHT;
        } else if (isPlayerBelow) {
            this.actions = gunEnemy.down;
            return DIRECTION_DOWN;
        }
    }
}

