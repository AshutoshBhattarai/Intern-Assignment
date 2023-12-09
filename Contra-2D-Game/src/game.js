/* --------------- All the game contents and logics goes here --------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mapIndex = 3;
let bullets = [];
let lastBullet = 0;
let level = new Level(0, 0, ctx, mapIndex);
level.getCollisionBlocks();
// console.log(level.collisionBlocks);
const player = new Player(level.getPlayerSpawnPosition().x,
    level.getPlayerSpawnPosition().y - PLAYER_HEIGHT,
    ctx,
    level.collisionBlocks);
// const enemy = new Enemy(level.getRunningEnemySpawnPostion().x,
//     level.getRunningEnemySpawnPostion().y - PLAYER_HEIGHT, RUNNING_ENEMY, level.collisionBlocks);
function render() {
    if (player.xAxis > level.width) {
        if (mapIndex >= MAP_SECTION_ARRAY.length - 1) {
            mapIndex = 0;
        }
        mapIndex++;
        level = new Level(0, 0, ctx, mapIndex);
        level.getCollisionBlocks();

        let playerLastPosY = player.yAxis;
        player.xAxis = 0;
        player.yAxis = playerLastPosY;
        player.collisionBlocks = level.collisionBlocks;
    }

    level.draw();
    playerRender();
    updateBullets();
    detectMovement();
    // girdDraw(ctx, MAP_SECTION_ARRAY[mapIndex]);
    requestAnimationFrame(render);
}
render();
function playerRender() {
    player.draw();
    player.update();
    player.checkBoundary();
}

function detectMovement() {
    const currentTime = Date.now();
    const bulletX = player.facing === DIRECTION_RIGHT ? player.xAxis + player.width : player.xAxis;
    const canShoot = currentTime - lastBullet > BULLET_COOLDOWN;

    if (inputs.shoot) {
        if (!inputs.up && !inputs.down && canShoot) {
            shootBullet(bulletX, player.yAxis + player.height / 3, player.facing);
            lastBullet = currentTime;
        } else if (inputs.up && !inputs.left && !inputs.right && canShoot) {
            shootBullet(player.xAxis + player.width / 2, player.yAxis, DIRECTION_UP);
            lastBullet = currentTime;
        } else if (inputs.left && inputs.down && canShoot) {
            shootBullet(player.xAxis, player.yAxis + player.height / 2, DIRECTION_DOWN_LEFT);
            lastBullet = currentTime;
        } else if (inputs.right && inputs.down && canShoot) {
            shootBullet(player.xAxis + player.width, player.yAxis + player.height / 2, DIRECTION_DOWN_RIGHT);
            lastBullet = currentTime;
        } else if (inputs.left && inputs.up && canShoot) {
            shootBullet(player.xAxis, player.yAxis, DIRECTION_UP_LEFT);
            lastBullet = currentTime;
        } else if (inputs.right && inputs.up && canShoot) {
            shootBullet(player.xAxis + player.width, player.yAxis, DIRECTION_UP_RIGHT);
            lastBullet = currentTime;
        }
    }
}

function shootBullet(xAxis, yAxis, direction) {
    const bullet = new Bullet(xAxis, yAxis, direction);
    bullets.push(bullet);
}
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const currentBullet = bullets[i];
        currentBullet.update();
        currentBullet.draw(ctx);
    }
}


