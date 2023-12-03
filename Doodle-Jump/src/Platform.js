/* -------------------------------------------------------------------------- */
/*                               Platform Class                               */
/* -------------------------------------------------------------------------- */

class Platform {
    constructor(xAxis, yAxis, width, height) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = width;
        this.height = height;
    }

    //Draws platform of width and height on given x and y axis
    draw(ctx) {
        let platform = new Image();
        platform.src = './assets/images/platform.png';
        ctx.drawImage(platform, this.xAxis, this.yAxis, this.width, this.height);
    }
}