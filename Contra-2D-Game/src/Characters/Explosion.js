class Explosion {
    constructor(xAxis, yAxis, type) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.type = type;
        this.radius = this.type == EXPLOSION_NORMAL ? TILE_SIZE * 1.5 : TILE_SIZE * 2;
        this.image = new Image();
        this.image.src = './assets/images/Contra-Extras.gif';
        this.frame = 0;
        this.state = this.type == EXPLOSION_NORMAL ? normalExplosionSprite[this.frame] : cloudExplosionSprite[this.frame];
        this.animationTimer = 0;
        this.removeExplosion = false;
    }

    draw(ctx) {
        const { x, y, width, height } = this.state;
        ctx.drawImage(this.image, x, y, width, height, this.xAxis, this.yAxis, this.radius, this.radius);
    }
    update() {
        const isNormalExplosion = this.type === EXPLOSION_NORMAL;
        const lastFrame = isNormalExplosion ? normalExplosionSprite.length - 1 : cloudExplosionSprite.length - 1;
        const endTime = isNormalExplosion ? 100 : 50;
        this.animationTimer++;
        if (this.animationTimer % 5 === 0 && this.frame < lastFrame) {
            this.frame++;
            this.state = isNormalExplosion ? normalExplosionSprite[this.frame] : cloudExplosionSprite[this.frame];
        } else if (this.frame >= lastFrame) {
            setTimeout(() => {
                this.removeExplosion = true;
            }, endTime);
        }
    }
}