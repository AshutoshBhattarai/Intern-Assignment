class GameMap {
    constructor(xAxis, yAxis, ctx, sectionIndex) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.collisionBlocks = [];
        this.enemies = [];
        this.ctx = ctx;
        this.sectionIndex = sectionIndex;
        this.section = MAP_SECTION_ARRAY[this.sectionIndex];

    }
    draw() {
        // Create a new Image object
        const background = new Image();
        // Get the coordinates and dimensions of the background sprite for the current section
        const { x, y, width, height } = mapBackgroundSprite[this.section];
        // Set the source of the background image
        background.src = '../../assets/images/NES - Contra - Level 1.png';
        // Once the background image is loaded, draw it on the canvas
        background.onload = () => {
            // Draw the background image on the canvas with the specified coordinates and dimensions
            this.ctx.drawImage(background, x, y, width, height, this.xAxis, this.yAxis, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    }
    createBlocksArray() {
        // Loop through each row in the map section
        mapSection[this.section].forEach((row, y) => {
            // Loop through each element in the row
            row.forEach((element, x) => {
                // Calculate the position of the element
                const positionX = x * TILE_SIZE;
                const positionY = y * TILE_SIZE;
                // Check the value of the element and perform corresponding actions
                switch (element) {
                    // If the element is a platform, create a collision block
                    case PLATFORM_ID:
                        this.createCollisionBlock(positionX, positionY, COLLISION_PLATFORM);
                        break;
                    // If the element is '7', set the player spawn position
                    case '7':
                        this.setPlayerSpawnPosition(positionX, positionY);
                        break;
                    // If the element is water, create a collision block for water
                    case WATER_ID:
                        this.createCollisionBlock(positionX, positionY, COLLISION_WATER);
                        break;
                    // If the element is a running enemy, spawn a running enemy
                    case ENEMY_RUNNING:
                        this.spawnRunningEnemy(positionX, positionY);
                        break;
                    case ENEMY_SOLDIER:
                        this.spawnSoldierEnemy(positionX, positionY);
                        break;
                }
            });
        });
    }
    createCollisionBlock(xAxis, yAxis, type) {
        // Created a new CollisionBlock object with the provided x and y axis values and type
        // Added the new CollisionBlock object to the collisionBlocks array
        this.collisionBlocks.push(new CollisionBlock(xAxis, yAxis, type));
    }

    spawnRunningEnemy(x, y) {
        console.log("Spawn Running enemy at X" + x + " and Y " + y);
    }
    spawnSoldierEnemy(x,y)
    {
        console.log("Spawn soldier enemy");
    }
}