class CollisionBlock {
    constructor(xAxis, yAxis, type) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.height = TILE_SIZE;
        this.width = TILE_SIZE;
        this.type = type;
        this.isColliding = false;

    }
    draw(ctx)
    {
        ctx.strokeStyle = "blue"
        ctx.strokeRect(this.xAxis,this.yAxis,this.width,this.height);
    }
    
}