class Player {
    constructor(xAxis, yAxis, width, height) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.inPlatform = false;
        this.facing = {
            left: true,
            right: false
        }
    }

    draw(ctx) {
        if (this.facing.left) {
            let player = new Image();
            player.src = '../assets/images/doodle-left.png'
            ctx.drawImage(player, this.xAxis, this.yAxis, this.width, this.height);
        }
        else {
            let player = new Image();
            player.src = '../assets/images/doodle-right.png'
            ctx.drawImage(player, this.xAxis, this.yAxis, this.width, this.height);
        }
    }

    move() {
        this.xAxis += this.velocityX;
        this.yAxis += this.velocityY;
        if (inputs.left || inputs.right) {
            this.velocityX = inputs.left ? -SPEED : SPEED;
            this.facing.left = inputs.left ? true : false;
            this.facing.right = inputs.right ? true : false;
        }
        else {
            this.velocityX = 0
        }
        if (this.inPlatform) {
            this.velocityY = 0;
            this.velocityY = INITIAL_VELOCITY_Y;
            this.inPlatform = false;
        }
        else {
            this.velocityY += GRAVITY;
        }


    }

    checkOutofBounds(canvasWidth) {
        if (this.xAxis + this.width / 2 > canvasWidth) {
            this.xAxis = 0;
        }
        if (this.xAxis < -this.width / 2) {
            this.xAxis = canvasWidth - this.width;
        }
    }
}