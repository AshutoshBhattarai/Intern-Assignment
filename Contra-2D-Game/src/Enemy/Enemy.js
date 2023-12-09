class Enemy {

    constructor(xAxis, yAxis, type, collisionBlocks) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.type = type;
        this.actions;
        this.inGround = false;
        this.directionLeft = true;
        this.velX = 0;
        this.velY = 0;
        this.collisionBlocks = collisionBlocks;
        this.enemyImage = new Image();
        this.enemyImage.src = "../../assets/images/Enemies.gif";
    }
    draw(ctx) {
        if (this.type === RUNNING_ENEMY) {
            this.actions = runningEnemy.runningLeft[5];
        }

        // ctx.fillStyle = "red";
        // ctx.fillRect(this.xAxis, this.yAxis, this.width, this.height);
        // ctx.strokeStyle = 'red';
        ctx.drawImage(this.enemyImage,
            this.actions.x,
            this.actions.y,
            this.actions.width,
            this.actions.height,
            this.xAxis,
            this.yAxis,
            this.width,
            this.height
            );   
    }
    
    update() {
        this.checkBoundary()
        this.checkVerticalCollisions()
        if (!this.inGround) {
            this.useGravity()
        }
        if(this.directionLeft)
        {
            this.moveLeft()
        }
        else
        {
            this.moveRight()
        }
        if(!this.checkInCollision)
        {
            this.directionLeft = !this.directionLeft;
        }
        this.xAxis += this.velX;
        this.yAxis += this.velY
    }
    useGravity() {
        this.velY += GRAVITY;
    }
    moveLeft()
    {
        this.velX -= SPEED;
        this.velX = this.velX < -SPEED_LIMIT ? -SPEED_LIMIT : this.velX;

    }
    moveRight()
    {
        this.velX += SPEED;
        this.velX = this.velX < SPEED_LIMIT ? SPEED_LIMIT : this.velX;
        this.actions = runningEnemy.runningLeft[0];
    }
    checkVerticalCollisions() {
        this.collisionBlocks.forEach((collisionBlocks) => {
            if (detectCollision(this, collisionBlocks)) {
                if (this.velY > 0 && !this.inGround && collisionBlocks.type == COLLISION_PLATFORM) {
                    this.velY = 0;
                    this.yAxis = collisionBlocks.yAxis - this.height - 1;
                    this.inGround = true;
                }
            }
        });
    }
    checkInCollision() {
        return this.collisionBlocks.some((collisionBlock) =>
            detectCollision(this, collisionBlock)
        );
    }
    checkBoundary() {
        if (this.xAxis < 0) {
            this.xAxis = 0;
        }
        if (this.xAxis > CANVAS_WIDTH - PLAYER_WIDTH) {
            this.xAxis = CANVAS_WIDTH - PLAYER_WIDTH;
            this.moveLeft()
        }
        if (this.yAxis > CANVAS_HEIGHT - PLAYER_HEIGHT) {
            this.yAxis = CANVAS_HEIGHT - PLAYER_HEIGHT;
        }
    }
}