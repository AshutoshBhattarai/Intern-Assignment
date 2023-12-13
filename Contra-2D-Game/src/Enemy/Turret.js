class Turret {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.angle = 0;
        this.health = 5;
        this.height = TILE_SIZE * 2;
        this.width = TILE_SIZE * 2;
        this.lastBulletTime = 0;
        this.bulletSpeed = 3;
        this.bullets = [];
        this.bulletBurst = 0;
        this.action = turretSprites.left;
        this.turretImage = new Image();
        this.bulletImage = new Image();
        this.turretImage.src = '../../assets/images/Contra-Tanks.gif'
        this.bulletImage.src = '../../assets/images/Contra-Extras.gif'
    }

    draw(ctx) {
        this.#findDirection(this.angle)
        const { x, y, height, width } = this.action;
        ctx.drawImage(this.turretImage, x, y, width, height, this.xAxis - 2, this.yAxis - 7, this.width, this.height);
        this.bullets.forEach(bullet => {
            const { x, y, height, width } = enemyBulletSprite;
            ctx.drawImage(this.bulletImage, x, y, height, width, bullet.xAxis + 20, bullet.yAxis + 20, bullet.width, bullet.height);
        });
    }
    calculateAngleToPlayer(player) {
        this.angle = Math.atan2(player.yAxis - this.yAxis, player.xAxis - this.xAxis);
    }

    checkPlayerBulletCollision(player) {
        this.bullets.forEach((bullet, index) => {
            if(!player.isSpawning)
            {
                if (detectRectCollision(player, bullet)) {
                    this.bullets.splice(index, 1);
                    respawnPlayerAfterHit()
                }
            }
        })
    }
    shoot() {
        const bulletSpeed = this.bulletSpeed;
        let currentTime = new Date();
        const canShoot = currentTime - this.lastBulletTime > BULLET_COOLDOWN;
        if (canShoot) {
            const xOffset = Math.cos(this.angle) * (this.width / 2);
            const yOffset = Math.sin(this.angle) * (this.height / 2);
            const bullet = {
                // Adjust the starting position based on the turret's position and direction
                xAxis: this.xAxis + this.width / 3 + xOffset - 2, // -2 to fine-tune the position
                yAxis: this.yAxis + this.height / 3 + yOffset - 7,
                speed: bulletSpeed,
                height: 5,
                width: 5,
                angle: this.angle
            }
            if(this.bulletBurst < 3)
            {
                this.bulletBurst++;
                this.bullets.push(bullet);
            }
            this.lastBulletTime = currentTime;
        }
    }

    updateBullets() {
        if(this.bulletBurst == 3 && this.bullets.length == 0)
        {
            this.bulletBurst = 0;
        }
        this.bullets.forEach((bullet) => {
            bullet.xAxis += Math.cos(bullet.angle) * bullet.speed;
            bullet.yAxis += Math.sin(bullet.angle) * bullet.speed;
        });
        this.bullets = this.bullets.filter(bullet => bullet.xAxis >= 0
            && bullet.xAxis <= canvas.width
            && bullet.yAxis >= 0
            && bullet.yAxis <= canvas.height);
    }
    #findDirection(radian) {
        const angle = (radian * 180 / Math.PI + 360) % 360;
        if ((angle >= 0 && angle < 22.5) || (angle >= 337.5 && angle <= 360)) {
            this.action = turretSprites.right;
            // return "right";
        } else if (angle >= 22.5 && angle < 67.5) {
            this.action = turretSprites.downRight;
            // return "down-right";
        } else if (angle >= 67.5 && angle < 112.5) {
            this.action = turretSprites.down;
            // return "down";
        } else if (angle >= 112.5 && angle < 157.5) {
            this.action = turretSprites.downLeft;
            // return "down-left";
        } else if (angle >= 157.5 && angle < 202.5) {
            this.action = turretSprites.left;
            // return "left";
        } else if (angle >= 202.5 && angle < 247.5) {
            this.action = turretSprites.upLeft;
            // return "up-left";
        } else if (angle >= 247.5 && angle < 292.5) {
            this.action = turretSprites.up;
            // return "up";
        } else if (angle >= 292.5 && angle < 337.5) {
            this.action = turretSprites.upRight;
            // return "up-right";
        }
    }
}