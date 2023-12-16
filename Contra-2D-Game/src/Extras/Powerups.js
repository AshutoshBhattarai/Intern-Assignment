class Powerups {
    constructor(xAxis, yAxis, type) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.height = TILE_SIZE;
        this.width = TILE_SIZE;
        this.type = type;
        this.image = new Image();
        this.image.src = './assets/images/Contra-Extras.gif';
        this.powerup;
    }
    draw(ctx) {
        // Define an temp object that maps powerup types to their respective sprite coordinates object
        const powerupTypes = {
            [POWERUP_HEALTH]: powerupSprite.extraHealth,
            [POWERUP_MULTIPLIER]: powerupSprite.extraPoints,
            [POWERUP_SPECIAL]: powerupSprite.specialMove,
        };
        const { x, y, width, height } = powerupTypes[this.type];
        ctx.drawImage(this.image, x, y, width, height, this.xAxis, this.yAxis, this.width, this.height);
    }
    update(end) {
        // Just jump up certain blocks to make the animation :)
        this.yAxis -= this.yAxis == end ? 0 : 5;
    }
}