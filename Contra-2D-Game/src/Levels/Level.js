class Level {
    constructor(xAxis, yAxis, ctx, sectionIndex) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.collisionBlocks = [];
        this.ctx = ctx;
        this.sectionIndex = sectionIndex;
        this.section = MAP_SECTION_ARRAY[this.sectionIndex];
        this.playerSpawnPosition = {
            x: 0,
            y: 0,
        }
        this.runningEnemySpawnPosition = {
            x: 0,
            y: 0,
        }
    }
    draw() {
        const backgroundImage = new Image();
        backgroundImage.src = '../../assets/images/NES - Contra - Level 1.png';
        backgroundImage.onload = () => {
            const backgroundSprite = mapBackgroundSprite[this.section];
            this.ctx.drawImage(backgroundImage, backgroundSprite.x, backgroundSprite.y,
                backgroundSprite.width, backgroundSprite.height, this.xAxis, this.yAxis,
                CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        this.getCollisionBlocks();

    }

    setPlayerSpawnPosition(xAxis, yAxis) {
        this.playerSpawnPosition.x = xAxis;
        this.playerSpawnPosition.y = yAxis;
    }

    getPlayerSpawnPosition() {
        return {
            x: this.playerSpawnPosition.x,
            y: this.playerSpawnPosition.y,
        };
    }
    getCollisionBlocks() {
        mapSection[this.section].forEach((row, y) => {
            row.forEach((el, x) => {
                const posX = x * TILE_SIZE;
                const posY = y * TILE_SIZE;
                switch (el) {
                    case PLATFORM_ID:
                        this.createCollisionBlock(posX, posY, COLLISION_PLATFORM);
                        break;
                    case '7':
                        this.setPlayerSpawnPosition(posX, posY);
                        break;
                    case WATER_ID:
                        this.createCollisionBlock(posX, posY, COLLISION_WATER);
                        break;
                    case RUNNING_ENEMY:
                        this.spawnRunningEnemy(posX, posY);
                        break;
                }
            });
        });
    }
    createCollisionBlock(xAxis, yAxis, type) {
        this.collisionBlocks.push(new CollisionBlock(xAxis, yAxis, type));
    }

    spawnRunningEnemy(x,y)
    {
        console.log("Runnig enemy spawns  at" + x , y );
    }
}