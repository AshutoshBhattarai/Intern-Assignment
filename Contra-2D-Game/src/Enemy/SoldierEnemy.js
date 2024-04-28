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
        const { x, y, width, height } = this.actions;
        ctx.drawImage(this.enemyImage, x, y, width, height, this.xAxis, this.yAxis, this.width, this.height);
    }
    update() {
        this.yAxis += this.velY;
        this.checkVerticalCollisions();
        if (!this.inGround) {
            this.useGravity();
        }
    }
    shoot(player) {
        const direction = this.getEnemyShootingDirection(player);
        const currentTime = Date.now();
        const canShoot = currentTime - this.lastBullet > BULLET_COOLDOWN;
        const from = ENEMY_SOLDIER;

        if (canShoot) {
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

    shootBullet(x, y, direction) {
        if (this.bullets.length === 0 && this.bulletCount === this.bulletLimit) {
            this.bulletCount = 0;
        }

        const bullet = new Bullet(x, y, direction, ENEMY_SOLDIER, false, this.bullets);

        if (this.bulletCount < this.bulletLimit) {
            playAudio(gameAudios.enemyShooting);
            this.bulletCount++;
            this.bullets.push(bullet);
        }
    }



    getEnemyShootingDirection(player) {
        const { xAxis, yAxis } = player;
        const { xAxis: enemyXAxis, yAxis: enemyYAxis } = this;

        const isPlayerToLeft = xAxis < enemyXAxis - (PLAYER_WIDTH + 20);
        const isPlayerToRight = xAxis > enemyXAxis + (PLAYER_WIDTH + 20);

        const isPlayerAbove = yAxis < enemyYAxis - PLAYER_HEIGHT;
        const isPlayerBelow = yAxis > enemyYAxis + PLAYER_HEIGHT;

        if (isPlayerToLeft && isPlayerAbove) {
            this.actions = gunEnemy.upLeft;
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

