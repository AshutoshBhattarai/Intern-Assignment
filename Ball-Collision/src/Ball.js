class Ball {
    constructor(xAxis, yAxis, radius,color) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.radius = radius;
        this.color = color;
        this.element = document.createElement("div");
        this.element.className = "ball";
        this.moveX = getRandomNumber(-1, 1)
        this.moveY = getRandomNumber(-1, 1)
    }

    getElement = () => { return this.element }

    draw() {
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.height = `${this.radius * 2}px`;
        this.element.style.left = `${this.xAxis}px`;
        this.element.style.top = `${this.yAxis}px`;
        this.element.style.background = this.color;
    }

    move = () => {
        this.xAxis += this.moveX * SPEED;
        this.yAxis += this.moveY * SPEED;

    }
    checkWallCollision() {
        if (this.xAxis + this.radius * 2 > VIEW_WIDTH || this.xAxis < 0) {
            this.moveX = -this.moveX
        }
        if (this.yAxis + this.radius * 2 > VIEW_HEIGHT || this.yAxis < 0) {
            this.moveY = -this.moveY
        }
    }
    checkBallCollision()
    {
        this.moveY = -this.moveY
        this.moveX = -this.moveX

    }
}