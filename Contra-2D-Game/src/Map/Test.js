//const mapGrid = mapSection[MAP_SECTION_1_ID]


const platform = { x: 62, y: 110, height: 64, width: 64 }
// const bg = new Image();
// bg.src = '../../assets/images/NES - Contra - Level 1.png'
function girdDraw(ctx,section) {
    let mapGrid = mapSection[section];
    for (let i = 0; i < mapGrid.length; i++) {
        for (let j = 0; j < mapGrid[i].length; j++) {
            if (mapGrid[i][j] == 0) {
                drawGrid(j, i, ctx);
            }
        }
    }
}
function drawGrid(boxX, boxY, ctx) {
    // ctx.drawImage(bg,
    //     platform.x,
    //     platform.y,
    //     platform.width,
    //     platform.height,
    //     boxX * 80,
    //     boxY * 50,
    //     80,
    //     50);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeStyle = '#fff';
    ctx.fillRect(boxX * TILE_SIZE, boxY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeRect(boxX * TILE_SIZE, boxY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

