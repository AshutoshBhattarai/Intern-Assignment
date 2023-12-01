class Ball {
    constructor(xAxis, yAxis, radius, color) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.radius = radius;
        this.color = color;
        this.element = document.createElement("div");
        this.element.className = "ball";
        //Initiates random direction movement of the ball
        this.moveX = getRandomNumber(-1, 1)
        this.moveY = getRandomNumber(-1, 1)
        //Not in use currently
        this.mass = radius / 5;
    }

    getElement = () => { return this.element }

    draw() {
        //Draws the ball element
        this.element.style.width = `${this.radius * 2}px`;
        this.element.style.height = `${this.radius * 2}px`;
        this.element.style.left = `${this.xAxis}px`;
        this.element.style.top = `${this.yAxis}px`;
        this.element.style.background = this.color;
    }

    move = () => {
        //Moves the ball by certain pixels in x and y axis
        this.xAxis += this.moveX * SPEED;
        this.yAxis += this.moveY * SPEED;

    }

    // Checking Wall Collision
    checkWallCollision() {
        if (this.xAxis + this.radius * 2 > VIEW_WIDTH) {
            // Prevents the ball from going out of the boundary
            // Places the ball at the boundary if it tries to go out
            this.xAxis = VIEW_WIDTH - this.radius * 2;
            //Moves the ball in opposite direction
            this.moveX = -this.moveX
        }
        if (this.xAxis < 0) {
            //Same case as above
            this.xAxis = 0;
            this.moveX = -this.moveX;
        }
        if (this.yAxis < 0) {
            this.yAxis = 0;
            this.moveY = -this.moveY;
        }
        if (this.yAxis + this.radius * 2 > VIEW_HEIGHT) {
            this.yAxis = VIEW_HEIGHT - this.radius * 2;
            this.moveY = -this.moveY;
        }
    }
    checkBallCollision(balls) {
        balls.forEach((ball) => {
            if (ball == this) return;
            else {
                const dx = this.xAxis - ball.xAxis;
                const dy = this.yAxis - ball.yAxis;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius + ball.radius) {

                    /* --------------- Transfering Momentum of two colliding Balls -------------- */
                    let tempX = this.moveX;
                    let tempY = this.moveY;

                    this.moveX = ball.moveX;
                    this.moveY = ball.moveY;

                    ball.moveX = tempX;
                    ball.moveY = tempY;


                    //Calculation of angle of collision to prevent overlapping of elements
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    //checking overlap (+0.5/+1 is used to prevent floating point calc irregularities of overlapping of elements)
                    const overlap = this.radius + ball.radius - distance + 0.5;
                    this.xAxis += overlap * cos;
                    this.yAxis += overlap * sin;
                }
            }
        })
    }

    // ?----------------------- Mass Collision Calculation ----------------------- */
    // !Ball stops moving at certain point after collision(!!!Not in use!!!!)
    checkMassCollision(balls) {
        balls.forEach((ball) => {
            if (ball == this) return;
            else {
                const dx = this.xAxis - ball.xAxis;
                const dy = this.yAxis - ball.yAxis;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius + ball.radius) {
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    let thisXVel = this.moveX * cos
                    let ballXVel = ball.moveX * cos
                    let currentBallYVel = this.moveY * sin
                    let ballYVel = ball.moveY * sin
                    let newThisXVel = ((this.mass - ball.mass) / (this.mass + ball.mass)) * thisXVel + (2 * ball.mass / (this.mass + ball.mass)) * ballXVel;
                    let newBallXVel = (2 * this.mass / (this.mass + ball.mass)) * thisXVel + ((ball.mass - this.mass) / (ball.mass + this.mass)) * ballXVel;
                    let newThisYVel = currentBallYVel;
                    let newBallYVel = ballYVel;
                    this.moveX = newThisXVel;
                    ball.moveX = newBallXVel;
                    this.moveY = newThisYVel;
                    ball.moveY = newBallYVel;
                    const overlap = this.radius + ball.radius - distance + 0.5;
                    this.xAxis += overlap * cos;
                    this.yAxis += overlap * sin;
                }
            }
        })
    }
}

