class Bullet {
    constructor(xAxis, yAxis, direction) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.direction = direction;
        this.width = 5;
        this.height = 5;

    }

    setXAxis(xAxis) {
        this.xAxis = xAxis;
    }
    setYAxis(yAxis) {
        this.yAxis = yAxis;
    }
    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.xAxis, this.yAxis, this.width, this.height);
    }
    update() {
        if (this.direction === DIRECTION_RIGHT) {
            this.xAxis += BULLET_SPEED;
        }
        if (this.direction === DIRECTION_LEFT) {
            this.xAxis -= BULLET_SPEED;
        }
        if(this.direction === DIRECTION_UP){
            this.yAxis -= BULLET_SPEED;
        }
        if(this.direction === DIRECTION_DOWN_LEFT)
        {
            this.yAxis += BULLET_SPEED;
            this.xAxis -= BULLET_SPEED;
        }
        if(this.direction === DIRECTION_DOWN_RIGHT)
        {
            this.yAxis += BULLET_SPEED;
            this.xAxis += BULLET_SPEED;
        }
        if(this.direction === DIRECTION_UP_LEFT)
        {
            this.yAxis -= BULLET_SPEED;
            this.xAxis -= BULLET_SPEED;
        }
        if(this.direction === DIRECTION_UP_RIGHT)
        {
            this.yAxis -= BULLET_SPEED;
            this.xAxis += BULLET_SPEED;
        }
        if (this.isOutOfBounds()) {
            this.removeBullet();
        }
    }

    isOutOfBounds() {
        const { xAxis, yAxis } = this;
        const { width, height } = canvas;
        return xAxis > width || xAxis < 0 || yAxis > height || yAxis < 0;
    }
    removeBullet() {
        const bulletIndex = bullets.indexOf(this);
        if (bulletIndex !== -1) {
            bullets.splice(bulletIndex, 1);
        }
    }
}