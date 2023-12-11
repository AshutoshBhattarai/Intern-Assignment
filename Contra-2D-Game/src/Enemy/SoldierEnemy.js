class SoldierEnemy extends Enemy {
    constructor(xAxis, yAxis, collisionBlocks) {
        super(xAxis, yAxis, collisionBlocks);
        this.health = 3;
        this.actions = gunEnemy.downRight;
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
        this.yAxis += this.velY;
        this.checkVerticalCollisions();
        if (!this.inGround) {
            this.useGravity()
        }
    }
}