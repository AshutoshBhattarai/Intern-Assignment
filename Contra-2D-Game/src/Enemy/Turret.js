class Turret {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.angle = 0;
        this.health = TURRET_HEALTH;
        this.height = TURRET_HEIGHT;
        this.width = TURRET_WIDTH;
        this.lastBulletTime = 0;
        this.bulletSpeed = TURRET_BULLET_SPEED;
        this.bullets = [];
        this.bulletBurst = 0;
        this.burstLimit = TURRET_BULLET_LIMIT;
        this.bulletInitialX = this.xAxis;
        this.bulletInitialY = this.yAxis;
        this.isOpen = false;
        this.animationTimer = 0;
        this.action = turretSprites.left;
        this.turretImage = new Image();
        this.bulletImage = new Image();
        this.turretImage.src = './assets/images/Contra-Tanks.gif'
        this.bulletImage.src = './assets/images/Contra-Extras.gif'
        if (difficulty != DIFFICULTY_EASY) {
            this.bulletSpeed = difficulty == DIFFICULTY_MEDIUM ? (TURRET_BULLET_SPEED + 1) : (TURRET_BULLET_LIMIT + 2);
            this.burstLimit = difficulty == DIFFICULTY_MEDIUM ? (TURRET_BULLET_LIMIT + 1) : (TURRET_BULLET_LIMIT + 2);
            this.health = difficulty == DIFFICULTY_MEDIUM ? (TURRET_HEALTH + 2) : (TURRET_HEALTH + 4);
        }
    }

    draw(ctx) {
        this.#findDirection(this.angle)
        const { x, y, height, width } = this.action;
        ctx.drawImage(this.turretImage, x, y, width, height, this.xAxis - 2, this.yAxis - 7, this.width, this.height);
        this.bullets.forEach(bullet => {
            const { x, y, height, width } = bulletSprite.enemy;
            ctx.drawImage(this.bulletImage, x, y, height, width, bullet.xAxis + 20, bullet.yAxis + 20, bullet.width, bullet.height);
        });
    }
    calculateAngleToPlayer(player) {
        this.angle = Math.atan2(player.yAxis - this.yAxis, player.xAxis - this.xAxis);
    }

    checkPlayerBulletCollision(player) {
        this.bullets.forEach((bullet, index) => {
            if (!player.isSpawning) {
                if (detectRectCollision(player, bullet)) {
                    this.bullets.splice(index, 1);
                    respawnPlayerAfterHit()
                }
            }
        })
    }
    shoot() {
        let currentTime = new Date();
        const canShoot = currentTime - this.lastBulletTime > BULLET_COOLDOWN;
        if (canShoot) {
            // Create a new bullet object with the specified properties
            const bullet = {
                xAxis: this.bulletInitialX,
                yAxis: this.bulletInitialY,
                speed: this.bulletSpeed,
                height: 5,
                width: 5,
                angle: this.angle
            }
            // Check if the burst limit has not been reached yet
            if (this.bulletBurst < this.burstLimit) {
                // Increment the burst count and add the bullet to the bullets array
                this.bulletBurst++;
                this.bullets.push(bullet);
            }
            // Update the last bullet time to the current time
            this.lastBulletTime = currentTime;
        }
    }

    updateBullets() {
        // Filter out bullets that are out of bounds
        this.bullets = this.bullets.filter(bullet =>
            bullet.xAxis >= 0 && bullet.xAxis <= canvas.width &&
            bullet.yAxis >= 0 && bullet.yAxis <= canvas.height - 60
        );
        // Update the position of each bullet
        this.bullets.forEach(bullet => {
            bullet.xAxis += Math.cos(bullet.angle) * bullet.speed;
            bullet.yAxis += Math.sin(bullet.angle) * bullet.speed;
        });
        // Reset the bullet burst counter if burst limit is reached and all bullets are gone
        if (this.bulletBurst === this.burstLimit && this.bullets.length === 0) {
            this.bulletBurst = 0;
        }
    }
    //Adjust turret shooting position based on the angle of the player
    #findDirection(radian) {
        const angle = (radian * 180 / Math.PI + 360) % 360;
        // Right
        if ((angle >= 0 && angle < 22.5) || (angle >= 337.5 && angle <= 360)) {
            this.action = turretSprites.right;
            this.bulletInitialX = this.xAxis + TILE_SIZE + 10;
            this.bulletInitialY = this.yAxis + 5;
            //Down Right
        } else if (angle >= 22.5 && angle < 67.5) {
            this.action = turretSprites.downRight;
            this.bulletInitialX = this.xAxis + TILE_SIZE + 10;
            this.bulletInitialY = this.yAxis + TILE_SIZE;
        }
        // Down Left";
        else if (angle >= 112.5 && angle < 157.5) {
            this.action = turretSprites.downLeft;
            this.bulletInitialX = this.xAxis;
            this.bulletInitialY = this.yAxis + TILE_SIZE;
        }
        // Down 
        else if (angle >= 67.5 && angle < 112.5) {
            this.bulletInitialX = this.xAxis + 15;
            this.bulletInitialY = this.yAxis + TILE_SIZE + 5;
            this.action = turretSprites.down;
        }
        // Left;

        else if (angle >= 157.5 && angle < 202.5) {
            this.action = turretSprites.left;
            this.bulletInitialX = this.xAxis - 10;
            this.bulletInitialY = this.yAxis + 5;
        }
        // Up
        else if (angle >= 247.5 && angle < 292.5) {
            this.bulletInitialX = this.xAxis + 15;
            this.bulletInitialY = this.yAxis - TILE_SIZE + 5;
            this.action = turretSprites.up;
        }
        // Up Left
        else if (angle >= 202.5 && angle < 247.5) {
            this.action = turretSprites.upLeft;
            this.bulletInitialX = this.xAxis;
            this.bulletInitialY = this.yAxis - TILE_SIZE + 10;
        }
        // Up Right
        else if (angle >= 292.5 && angle < 337.5) {
            this.action = turretSprites.upRight;
            this.bulletInitialX = this.xAxis + TILE_SIZE;
            this.bulletInitialY = this.yAxis - TILE_SIZE + 10;
        }
    }


}