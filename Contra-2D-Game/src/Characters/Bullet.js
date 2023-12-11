class Bullet {
    constructor(xAxis, yAxis, direction, from) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.direction = direction;
        this.from = from;
        this.width = 5;
        this.bulletSpeed = this.from === ENEMY_SOLDIER ? ENEMY_BULLET_SPEED : BULLET_SPEED;
        this.height = 5;

    }

    draw(ctx) {
        ctx.fillStyle = this.from === PLAYER_ID ? "red" : "yellow";
        ctx.fillRect(this.xAxis, this.yAxis, this.width, this.height);
    }

    update() {
        if (this.direction === DIRECTION_RIGHT) {
            this.xAxis += this.bulletSpeed;
        }
        if (this.direction === DIRECTION_LEFT) {
            this.xAxis -= this.bulletSpeed;
        }
        if (this.direction === DIRECTION_UP) {
            this.yAxis -= this.bulletSpeed;
        }
        if (this.direction === DIRECTION_DOWN) {
            this.yAxis += this.bulletSpeed;
        }
        if (this.direction === DIRECTION_DOWN_LEFT) {
            this.yAxis += this.bulletSpeed;
            this.xAxis -= this.bulletSpeed;
        }
        if (this.direction === DIRECTION_DOWN_RIGHT) {
            this.yAxis += this.bulletSpeed;
            this.xAxis += this.bulletSpeed;
        }
        if (this.direction === DIRECTION_UP_LEFT) {
            this.yAxis -= this.bulletSpeed;
            this.xAxis -= this.bulletSpeed;
        }
        if (this.direction === DIRECTION_UP_RIGHT) {
            this.yAxis -= this.bulletSpeed;
            this.xAxis += this.bulletSpeed;
        }
        if (this.isOutOfBounds()) {
            this.removeBullet(this.from);
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
    setXAxis(xAxis) {
        this.xAxis = xAxis;
    }
    setYAxis(yAxis) {
        this.yAxis = yAxis;
    }
}