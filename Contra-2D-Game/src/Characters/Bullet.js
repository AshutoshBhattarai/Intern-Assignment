class Bullet {
    constructor(xAxis, yAxis, direction, from, angle) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.direction = direction;
        this.angle = angle;
        this.from = from;
        this.width = 5;
        this.height = 5;
        this.bulletSpeed = this.from === ENEMY_SOLDIER ? ENEMY_BULLET_SPEED : BULLET_SPEED;
        this.bulletImage = new Image();
        this.bulletImage.src = './assets/images/Contra-Extras.gif'
        if (difficulty == DIFFICULTY_MEDIUM || difficulty == DIFFICULTY_HARD) {
            this.bulletSpeed = (difficulty == DIFFICULTY_MEDIUM && this.from == ENEMY_SOLDIER) ? (ENEMY_BULLET_SPEED + 1) : (ENEMY_BULLET_SPEED + 2);
        }
    }

    draw(ctx) {
        const { x, y, height, width } = this.from === ENEMY_SOLDIER ? bulletSprite.enemy : bulletSprite.player;
        ctx.drawImage(this.bulletImage, x, y, height, width, this.xAxis, this.yAxis, this.width, this.height);
    }

    update() {
        if (this.angle == undefined) {
            this.basicBulletMovement();
        }
        else {
            console.log("Shoot Accurate Bullets");
        }
        if (this.isOutOfBounds()) {
            this.removeBullet(this.from);
        }
    }
    basicBulletMovement() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.xAxis += this.bulletSpeed;
                break;
            case DIRECTION_LEFT:
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_UP:
                this.yAxis -= this.bulletSpeed;
                break;
            case DIRECTION_DOWN:
                this.yAxis += this.bulletSpeed;
                break;
            case DIRECTION_DOWN_LEFT:
                this.yAxis += this.bulletSpeed;
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_DOWN_RIGHT:
                this.yAxis += this.bulletSpeed;
                this.xAxis += this.bulletSpeed;
                break;
            case DIRECTION_UP_LEFT:
                this.yAxis -= this.bulletSpeed;
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_UP_RIGHT:
                this.yAxis -= this.bulletSpeed;
                this.xAxis += this.bulletSpeed;
                break;
        }
    }

    isOutOfBounds() {
        const { xAxis, yAxis } = this;
        const { width, height } = canvas;
        return xAxis > width || xAxis < 0 || yAxis > height - 40 || yAxis < 0;
    }
    removeBullet(from) {
        if (from === PLAYER_ID) {
            const bulletIndex = playerBullets.indexOf(this);
            if (bulletIndex !== -1) {
                playerBullets.splice(bulletIndex, 1);
            }
        }
        else {
            const bulletIndex = enemyBullets.indexOf(this);
            if (bulletIndex !== -1) {
                enemyBullets.splice(bulletIndex, 1);
            }
        }
    }
}