/* --------------- All the game contents and logics goes here --------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
/* -------------------------------------------------------------------------- */
/*                            Initial Initilization                           */
/* -------------------------------------------------------------------------- */
let mapIndex = 0;
let difficulty = DIFFICULTY_EASY;//localStorage.getItem(difficulty) == null ? DIFFICULTY_EASY : localStorage.getItem(difficulty);
let playerBullets = [];
let enemyBullets = [];
let playerLastBullet = 0;
let enemyLastBullet = 0;
let enemyBulletCount = 0;
let score = 0;
let scoreMultiplier = difficulty === DIFFICULTY_MEDIUM ? SCORE_MULTIPLIER_MEDIUM : SCORE_MULTIPLIER_HARD;
let gameMap = new GameMap(0, 0, ctx, mapIndex);
gameMap.createBlocksArray();
let enemiesArray = gameMap.enemies;
let turretsArray = gameMap.turrets;
const player = new Player(PLAYER_INITIAL_SPAWN_X, PLAYER_INITIAL_SPAWN_Y, ctx, gameMap.collisionBlocks);
/* ----------------------------------- --- ---------------------------------- */
function render() {
    if (enemyBullets.length == 0 && enemyBulletCount == 3) {
        enemyBulletCount = 0;
    }
    if (player.xAxis > gameMap.width) {
        if (mapIndex >= MAP_SECTION_ARRAY.length - 1) {
            mapIndex = getRandomMapIndex(3, 6);
        }
        mapIndex++;
        increaseScoreOnDistance();
        updateGameMap();
    }
    drawGameMap();
    updateEnemies();
    playerRender();
    updateBullets(playerBullets);
    updateBullets(enemyBullets);
    detectMovement();
    if (!player.isSpawning) {
        checkPlayerCollisions();
    }
    checkEnemyBulletCollision();
    turretBulletCollision();
    displayPlayerHealthState(player.lives);
    displayPlayerScore()
    /* ------------------ Draw Grid lines for testing Purposes ------------------ */
    // girdDraw(ctx, MAP_SECTION_ARRAY[mapIndex])
    /* ----------------------------------- -- ----------------------------------- */
    requestAnimationFrame(render);
}
render();

function updateGameMap() {
    playerBullets = [];
    enemyBullets = [];
    gameMap.enemies = [];
    gameMap = new GameMap(0, 0, ctx, mapIndex);
    gameMap.createBlocksArray();
    enemiesArray = gameMap.enemies;
    turretsArray = gameMap.turrets;
    player.xAxis = 0;
    player.yAxis = getPlayerLastPosY();
    player.collisionBlocks = gameMap.collisionBlocks;
}

function drawGameMap() {
    gameMap.draw();
}

function updateEnemies() {
    enemiesArray.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
        if (enemy.canShoot && checkPlayerInProximity(enemy)) {
            enemyShoot(getEnemyShootingDirection(enemy, player), enemy);
        }
    });
    turretsArray.forEach(turret => {
        turret.draw(ctx);
        turret.calculateAngleToPlayer(player);
        turret.checkPlayerBulletCollision(player)
        turret.updateBullets();
        if (checkPlayerInProximity(turret)) {
            turret.shoot();
        }
    })
}

function checkPlayerCollisions() {
    checkEnemyPlayerCollision();
    checkPlayerBulletCollision();
}

function getPlayerLastPosY() {
    return player.yAxis;
}

function getRandomMapIndex(min, max) {
    return Math.floor(generateRandomNumber(min, max));
}

function playerRender() {
    player.draw();
    player.update();
    player.checkBoundary();
}

function detectMovement() {
    const currentTime = Date.now();
    const bulletX = player.facing === DIRECTION_RIGHT ? player.xAxis + player.width : player.xAxis;
    const canShoot = currentTime - playerLastBullet > BULLET_COOLDOWN;
    const from = PLAYER_ID
    if (inputs.shoot) {
        player.velX = 0

        if (inputs.down && !inputs.left && !inputs.right && canShoot) {
            shootBullet(bulletX, player.yAxis + player.height * 2 / 4, player.facing, from);
            playerLastBullet = currentTime;
        }
        if (!inputs.up && !inputs.down && canShoot) {
            shootBullet(bulletX, player.yAxis + player.height / 3, player.facing, from);
            playerLastBullet = currentTime;
        }
        if (!player.inWater) {
            if (inputs.up && !inputs.left && !inputs.right && canShoot) {
                shootBullet(player.xAxis + player.width / 2, player.yAxis, DIRECTION_UP, from);
                playerLastBullet = currentTime;
            } else if (inputs.left && inputs.down && canShoot) {
                shootBullet(player.xAxis, player.yAxis + player.height / 2, DIRECTION_DOWN_LEFT, from);
                playerLastBullet = currentTime;
            } else if (inputs.right && inputs.down && canShoot) {
                shootBullet(player.xAxis + player.width, player.yAxis + player.height / 2, DIRECTION_DOWN_RIGHT, from);
                playerLastBullet = currentTime;
            } else if (inputs.left && inputs.up && canShoot) {
                shootBullet(player.xAxis, player.yAxis, DIRECTION_UP_LEFT, from);
                playerLastBullet = currentTime;
            } else if (inputs.right && inputs.up && canShoot) {
                shootBullet(player.xAxis + player.width, player.yAxis, DIRECTION_UP_RIGHT, from);
                playerLastBullet = currentTime;
            }

        }
    }
}

function shootBullet(xAxis, yAxis, direction, from) {
    const bullet = new Bullet(xAxis, yAxis, direction, from);
    if (from === PLAYER_ID) { playerBullets.push(bullet); }
    if (from === ENEMY_SOLDIER) {
        if (enemyBulletCount < 3) {
            enemyBulletCount++;
            enemyBullets.push(bullet);
        }
    }
}
function updateBullets(bulletsArray) {
    for (let i = bulletsArray.length - 1; i >= 0; i--) {
        const currentBullet = bulletsArray[i];
        currentBullet.update();
        currentBullet.draw(ctx);
    }
}

function checkEnemyPlayerCollision() {
    enemiesArray.forEach((enemy, enemyIndex) => {
        if (detectRectCollision(player, enemy)) {
            if (!enemy.canShoot) {
                enemiesArray.splice(enemyIndex, 1);
                respawnPlayerAfterHit()
            }
        }
    })
}
function checkEnemyBulletCollision() {
    enemiesArray.forEach((enemy, enemyIndex) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (bullet.from == PLAYER_ID) {
                if (detectRectCollision(enemy, bullet)) {
                    playerBullets.splice(bulletIndex, 1);
                    increaseScoreOnHit();
                    enemy.health--;
                    if (enemy.health === 0) {
                        increaseScoreOnEnemyKilled(enemy);
                        enemiesArray.splice(enemyIndex, 1);
                    }
                }
            }
        })
    })
}
function turretBulletCollision() {
    turretsArray.forEach((turret, index) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (detectRectCollision(turret, bullet)) {
                if (turret.health === 0) {
                    increaseScoreOnTurretDestroyed()
                    turretsArray.splice(index, 1);
                }
                else {
                    increaseScoreOnHit();
                    turret.health--;
                    playerBullets.splice(bulletIndex, 1);

                }
            }
        })
    })
}
function checkPlayerBulletCollision() {
    enemyBullets.forEach((bullet, bulletIndex) => {
        if (detectRectCollision(player, bullet)) {
            enemyBullets.splice(bulletIndex, 1);
            respawnPlayerAfterHit()
        }
    })
}
function getEnemyShootingDirection(enemy, player) {
    if (player.xAxis < enemy.xAxis && player.yAxis < enemy.yAxis - PLAYER_HEIGHT) {
        enemy.actions = gunEnemy.upLeft;
        return DIRECTION_UP_LEFT;
    }
    else if (player.xAxis > enemy.xAxis && player.yAxis < enemy.yAxis - PLAYER_HEIGHT) {
        enemy.actions = gunEnemy.upRight;
        return DIRECTION_UP_RIGHT;
    }
    else if (player.xAxis > enemy.xAxis && player.yAxis > enemy.yAxis + PLAYER_HEIGHT) {
        enemy.actions = gunEnemy.downRight;
        return DIRECTION_DOWN_RIGHT;
    }
    else if (player.yAxis > enemy.yAxis + PLAYER_HEIGHT && player.xAxis < enemy.xAxis) {
        enemy.actions = gunEnemy.downLeft;
        return DIRECTION_DOWN_LEFT;
    }
    else if (player.xAxis < enemy.xAxis) {
        enemy.actions = gunEnemy.left;
        return DIRECTION_LEFT;
    }
    else if (player.yAxis < enemy.yAxis) {
        enemy.actions = gunEnemy.up;
        return DIRECTION_UP;
    }
    else if (player.xAxis > enemy.xAxis) {
        enemy.actions = gunEnemy.right;
        return DIRECTION_RIGHT;
    }
    else if (player.yAxis > enemy.yAxis) {
        enemy.actions = gunEnemy.down;
        return DIRECTION_DOWN;
    }
}

function checkPlayerInProximity(enemy) {
    // Calculating the distance between player and enemy using the distance formula
    const horizontalDistance = Math.abs(player.xAxis - enemy.xAxis);
    // Calculate the vertical distance between player and enemy
    const verticalDistance = Math.abs(player.yAxis - enemy.yAxis);
    // Checking if the distance is less than or equal to 80 pixels
    if (horizontalDistance <= CANVAS_WIDTH/2) {
        return true;
    } else {
        return false;
    }
}


function enemyShoot(direction, enemy) {
    // Get the current time
    const currentTime = Date.now();
    // Check if enough time has passed since the enemy last shot a bullet
    const canShoot = currentTime - enemyLastBullet > BULLET_COOLDOWN;
    // Set the origin of the bullet to the enemy soldier
    const from = ENEMY_SOLDIER;
    // If enough time has passed, determine the position and direction of the bullet based on the given direction
    if (canShoot) {
        let bulletX, bulletY, bulletDirection;
        if (direction === DIRECTION_LEFT) {
            bulletX = enemy.xAxis;
            bulletY = enemy.yAxis + enemy.height / 3;
            bulletDirection = DIRECTION_LEFT;
        } else if (direction === DIRECTION_RIGHT) {
            bulletX = enemy.xAxis + PLAYER_WIDTH;
            bulletY = enemy.yAxis + enemy.height / 3;
            bulletDirection = DIRECTION_RIGHT;
        } else if (direction === DIRECTION_UP) {
            bulletX = enemy.xAxis + enemy.width / 2;
            bulletY = enemy.yAxis;
            bulletDirection = DIRECTION_UP;
        } else if (direction === DIRECTION_UP_LEFT) {
            bulletX = enemy.xAxis;
            bulletY = enemy.yAxis;
            bulletDirection = DIRECTION_UP_LEFT;
        } else if (direction === DIRECTION_UP_RIGHT) {
            bulletX = enemy.xAxis + enemy.width;
            bulletY = enemy.yAxis;
            bulletDirection = DIRECTION_UP_RIGHT;
        } else if (direction === DIRECTION_DOWN_LEFT) {
            bulletX = enemy.xAxis;
            bulletY = enemy.yAxis + enemy.height / 2;
            bulletDirection = DIRECTION_DOWN_LEFT;
        } else if (direction === DIRECTION_DOWN_RIGHT) {
            bulletX = enemy.xAxis + enemy.width;
            bulletY = enemy.yAxis + enemy.height / 2;
            bulletDirection = DIRECTION_DOWN_RIGHT;
        }
        // If a valid bullet direction is determined, shoot the bullet and update the last bullet time
        if (bulletDirection) {
            shootBullet(bulletX, bulletY, bulletDirection, from);
            enemyLastBullet = currentTime;
        }
    }
}

function displayPlayerHealthState(healthLeft) {
    // Function to display the player's health state on the screen
    // Create a new Image object
    let image = new Image();
    // Destructure the properties x, y, height, and width from the healthDisplaySprite object
    let { x, y, height, width } = healthDisplaySprite;
    // Set the source of the image to the specified URL
    image.src = './assets/images/Contra-Extras.gif';
    // Loop from 1 to the player's current health state
    for (let i = 1; i <= healthLeft; i++) {
        // Draw the image onto the canvas
        ctx.drawImage(image, x, y, width, height, i * 20, 50, 50, 50);
    }
}
function displayPlayerScore() {
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = "white"
    ctx.fillText("Score: " + score, 20, 50);
}

function respawnPlayerAfterHit() {
    const { x, y } = gameMap.getPlayerReSpawnPosition();
    decreaseScoreOnHit();
    player.playerHit();
    player.playerReSpawn(x, y);
}
/* -------------------------------------------------------------------------- */
/*                             Score Manipulation                             */
/* -------------------------------------------------------------------------- */
/* ------------ Logic to manipulate Score on different Conditions ----------- */
function increaseScoreOnDistance() {
    score += SCORE_DISTANCE_TRAVELLED * (difficulty === DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function increaseScoreOnHit() {
    score += SCORE_HIT * (difficulty === DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function increaseScoreOnEnemyKilled(enemy) {
    const baseScore = enemy.canShoot ? SCORE_SOLDIER : SCORE_RUNNING_ENEMY;
    const finalScore = baseScore * (difficulty === DIFFICULTY_EASY ? 1 : scoreMultiplier);
    score += finalScore;
}
function increaseScoreOnTurretDestroyed() {
    score += SCORE_TURRET * (difficulty === DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function decreaseScoreOnHit() {
    score -= SCORE_HIT * (difficulty === DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
/* ----------------------------------- -- ----------------------------------- */

