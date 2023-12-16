/* --------------- All the game contents and logics goes here --------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
/* -------------------------------------------------------------------------- */
/*                     Initial Initilization Global Variables                 */
/* -------------------------------------------------------------------------- */
let mapIndex;
let difficulty;
let playerBullets;
let enemyBullets;
let playerLastBullet;
let enemyLastBullet;
let enemyBulletCount;
let score;
let scoreMultiplier;
let gameMap;
let enemiesArray;
let turretsArray;
let explosionArray;
let player;
let powerupArray;
let powerupBlock;
let gameAudio;


function init() {
    mapIndex = 0;
    gameAudio = new Audio(gameAudios.gameMusic);
    // gameAudio.play();

    difficulty = localStorage.getItem('difficulty') || DIFFICULTY_EASY;
    playerBullets = [];
    enemyBullets = [];
    powerupArray = [];
    explosionArray = [];
    playerLastBullet = 0;
    enemyLastBullet = 0;
    enemyBulletCount = 0;

    score = 0;
    scoreMultiplier = difficulty === DIFFICULTY_MEDIUM ? SCORE_MULTIPLIER_MEDIUM : SCORE_MULTIPLIER_HARD;

    gameMap = new GameMap(0, 0, ctx, mapIndex);
    gameMap.createBlocksArray();
    enemiesArray = gameMap.enemies;
    turretsArray = gameMap.turrets;
    powerupBlock = gameMap.powerupBlock;

    player = new Player(PLAYER_INITIAL_SPAWN_X, PLAYER_INITIAL_SPAWN_Y, ctx, gameMap.collisionBlocks);
}
function render() {
    if (enemyBullets.length == 0 && enemyBulletCount == 2) {
        enemyBulletCount = 0;
    }
    if (player.xAxis > gameMap.width) {
        // if (!turretsArray.length > 0 && !enemiesArray.length > 0) {
        if (mapIndex >= MAP_SECTION_ARRAY.length - 1) {
            mapIndex = getRandomMapIndex(3, 6);
        }
        mapIndex++;
        increaseScoreOnDistance();
        updateGameMap();
        // }
        // else {
        //player.xAxis = CANVAS_WIDTH - player.width;
        // }
    }
    powerupArray.forEach((power) => {
        if (power != "") {
            power.draw(ctx);
            power.update(TILE_SIZE * 6);
        }
    });
    explosionArray.forEach((explosion) => {
        explosion.draw(ctx);
        explosion.update();
        if (explosion.removeExplosion) {
            explosionArray.splice(explosionArray.indexOf(explosion), 1);
        }
    })

    drawGameMap();
    updateEnemies();
    drawPowerUpBlock();
    playerRender();
    updateBullets(playerBullets);
    updateBullets(enemyBullets);
    detectMovement();
    if (!player.isSpawning) {
        checkPlayerCollisions();
    }
    if (player.hasSpecialBullet) {
        showSpecialMove()
    }
    checkEnemyBulletCollision();
    turretBulletCollision();
    checkPowerUpCollision(player);
    displayPlayerHealthState(player.lives);
    displayPlayerScore();
    upgradeDifficulty();
    const gameAnimation = requestAnimationFrame(render);
    if (isGameOver()) {
        gameAudio.pause();
        cancelAnimationFrame(gameAnimation);
        displayGameOverScreen();
    }

    /* ------------------ Draw Grid lines for testing Purposes ------------------ */
    //girdDraw(ctx, MAP_SECTION_ARRAY[mapIndex])
    /* ----------------------------------- -- ----------------------------------- */
}

function updateGameMap() {
    playerBullets = [];
    enemyBullets = [];
    powerupArray = [];
    gameMap.enemies = [];
    gameMap = new GameMap(0, 0, ctx, mapIndex);
    gameMap.createBlocksArray();
    powerupBlock = gameMap.powerupBlock == undefined ? undefined : gameMap.powerupBlock;
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
        enemy.update(player);
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
    if (inputs.shoot && canShoot) {
        player.velX = 0;
        playAudio(gameAudios.playerGun);
        if (inputs.down && !inputs.left && !inputs.right) {
            shootBullet(bulletX, player.yAxis + player.height * 2 / 4, player.facing, from);
            playerLastBullet = currentTime;
        }
        if (!inputs.up && !inputs.down) {
            shootBullet(bulletX, player.yAxis + player.height / 3, player.facing, from);
            playerLastBullet = currentTime;
        }
        if (!player.inWater) {
            if (inputs.up && !inputs.left && !inputs.right) {
                shootBullet(player.xAxis + player.width / 2, player.yAxis, DIRECTION_UP, from);
                playerLastBullet = currentTime;
            } else if (inputs.left && inputs.down) {
                shootBullet(player.xAxis, player.yAxis + player.height / 2, DIRECTION_DOWN_LEFT, from);
                playerLastBullet = currentTime;
            } else if (inputs.right && inputs.down) {
                shootBullet(player.xAxis + player.width, player.yAxis + player.height / 2, DIRECTION_DOWN_RIGHT, from);
                playerLastBullet = currentTime;
            } else if (inputs.left && inputs.up) {
                shootBullet(player.xAxis, player.yAxis, DIRECTION_UP_LEFT, from);
                playerLastBullet = currentTime;
            } else if (inputs.right && inputs.up) {
                shootBullet(player.xAxis + player.width, player.yAxis, DIRECTION_UP_RIGHT, from);
                playerLastBullet = currentTime;
            }

        }
    }
}

function shootBullet(xAxis, yAxis, direction, from) {
    let isSpecialBullet = false;
    if (player.hasSpecialBullet && inputs.special) {
        isSpecialBullet = true;
        player.specialBulletCount -= 1;
    }
    const bullet = new Bullet(xAxis, yAxis, direction, from, isSpecialBullet);
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
                respawnPlayerAfterHit();
            }
        }
    })
}
function checkEnemyBulletCollision() {
    enemiesArray.forEach((enemy, enemyIndex) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (bullet.from == PLAYER_ID) {
                if (detectRectCollision(enemy, bullet)) {
                    if (bullet.isSpecial) {
                        createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_SPECIAL);
                    }
                    enemyHitSoundEffect();
                    playerBullets.splice(bulletIndex, 1);
                    increaseScoreOnHit();
                    enemy.health -= bullet.damage;
                    if (enemy.health <= 0) {
                        if (!bullet.isSpecial) {
                            createExplosionEffect(enemy.xAxis, enemy.yAxis, EXPLOSION_NORMAL);
                        }
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
                if (bullet.isSpecial) {
                    createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_SPECIAL);
                }
                if (turret.health <= 0) {
                    createExplosionEffect(turret.xAxis, turret.yAxis, EXPLOSION_SPECIAL);
                    increaseScoreOnTurretDestroyed()
                    turretsArray.splice(index, 1);
                }
                else {
                    if (!bullet.isSpecial) {
                        createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_NORMAL);
                    }
                    playAudio(gameAudios.metalHit)
                    increaseScoreOnHit();
                    turret.health -= bullet.damage;
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
    // Checking if the distance is less than or equal to half canvas width pixels
    if (horizontalDistance <= CANVAS_WIDTH / 2) {
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
function showSpecialMove() {
    let image = new Image();
    // Destructure the properties x, y, height, and width from the healthDisplaySprite object
    let { x, y, height, width } = powerupSprite.specialMove;
    // Set the source of the image to the specified URL
    image.src = './assets/images/Contra-Extras.gif';
    let gap = 50;
    for (let i = 1; i <= player.specialBulletCount; i++) {
        ctx.drawImage(image, x, y, width, height, CANVAS_WIDTH - gap, 50, 50, 50);
        gap += 50;
    }
}
function displayPlayerScore() {
    ctx.font = "20px VT323";
    ctx.fillStyle = "white"
    ctx.fillText("Score: " + score, 20, 50);
}


function checkPowerUpCollision(player) {
    powerupArray.forEach((power, index) => {
        if (detectRectCollision(player, power)) {
            playAudio(gameAudios.collectPowerup);
            if (power.type == POWERUP_HEALTH) {
                player.lives += 1;
            }
            if (power.type == POWERUP_MULTIPLIER) {
                score *= Math.ceil(difficulty == DIFFICULTY_EASY ? 1.25 : scoreMultiplier);
            }
            if (power.type == POWERUP_SPECIAL) {
                player.hasSpecialBullet = true;
                player.specialBulletCount++;
            }
            powerupArray.splice(index, 1);
        }
    })
}

function respawnPlayerAfterHit() {
    const { x, y } = gameMap.getPlayerReSpawnPosition();
    playerHitSoundEffect();
    decreaseScoreOnHit();
    player.playerHit();
    player.playerReSpawn(x, y);
}

/* -------------------------------------------------------------------------- */
/*                             Score Manipulation                             */
/* -------------------------------------------------------------------------- */
/* ------------ Logic to manipulate Score on different Conditions ----------- */
function increaseScoreOnDistance() {
    score += SCORE_DISTANCE_TRAVELLED * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function increaseScoreOnHit() {
    score += SCORE_HIT * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function increaseScoreOnEnemyKilled(enemy) {
    const baseScore = enemy.canShoot ? SCORE_SOLDIER : SCORE_RUNNING_ENEMY;
    score += baseScore * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function increaseScoreOnTurretDestroyed() {
    score += SCORE_TURRET * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
function decreaseScoreOnHit() {
    score -= SCORE_HIT * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
/* ----------------------------------- -- ----------------------------------- */
function isGameOver() {
    return player.isDead();
}
function playerHitSoundEffect() {
    playAudio(gameAudios.playerHit);
}
function enemyHitSoundEffect() {
    playAudio(gameAudios.enemyHit);
}

function drawPowerUpBlock() {
    if (powerupBlock != undefined) {
        powerupBlock.draw(ctx);
        powerupBlock.update(player);
        checkBulletPowerUpBlockCollision();
    }
}
function checkBulletPowerUpBlockCollision() {
    const randomPowerUp = Math.round(generateRandomNumber(1, 5));
    const shouldGeneratePowerUp = Math.round(generateRandomNumber(1, 2)) % 2 === 0;
    let powerUp;

    if (randomPowerUp < 2) {
        powerUp = POWERUP_HEALTH;
    } else if (randomPowerUp < 4) {
        powerUp = POWERUP_MULTIPLIER;
    } else {
        powerUp = POWERUP_SPECIAL;
    }

    playerBullets.forEach((bullet, index) => {
        if (powerupBlock.isOpen && detectRectCollision(bullet, powerupBlock)) {
            playAudio(gameAudios.metalHit);
            playerBullets.splice(index, 1);
            powerupBlock.hit--;

            if (powerupBlock.hit === 0) {
                if ((difficulty === DIFFICULTY_HARD || difficulty === DIFFICULTY_MEDIUM) && !shouldGeneratePowerUp) {
                    powerupArray.push("");
                } else {
                    powerupArray.push(new Powerups(powerupBlock.xAxis + TILE_SIZE, powerupBlock.yAxis, POWERUP_SPECIAL));
                }
            }
        }
    });
}

function upgradeDifficulty() {
    const EASY_THRESHOLD = 10000;
    const MEDIUM_THRESHOLD = 20000;
    if (difficulty === DIFFICULTY_EASY && score >= EASY_THRESHOLD) {
        difficulty = DIFFICULTY_MEDIUM;
        localStorage.setItem('difficulty', difficulty);
    } else if (difficulty === DIFFICULTY_MEDIUM && score >= MEDIUM_THRESHOLD) {
        difficulty = DIFFICULTY_HARD;
        localStorage.setItem('difficulty', difficulty);
    }
}

function createExplosionEffect(x, y, type) {
    const explosion = new Explosion(x, y, type);
    explosionArray.push(explosion);
}

