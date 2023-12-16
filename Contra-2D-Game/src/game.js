/* --------------- All the game contents and logics goes here --------------- */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
/* -------------------------------------------------------------------------- */
/*                     Initial Initilization Global Variables                 */
/* -------------------------------------------------------------------------- */
let mapIndex;
let difficulty;
let playerBullets;
let playerLastBullet;
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
    powerupArray = [];
    explosionArray = [];
    playerLastBullet = 0;

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
    // Reset enemy bullet count if there are no enemy bullets


    // Check if player is out of bounds
    if (player.xAxis > gameMap.width) {
        // Check if there are no turrets and enemies
        if (turretsArray.length === 0 && enemiesArray.length === 0) {
            // Check if mapIndex is the last index
            if (mapIndex >= MAP_SECTION_ARRAY.length - 1) {
                mapIndex = Math.round(generateRandomNumber(3, 6));
            }
            mapIndex++;
            increaseScoreOnDistance();
            updateGameMap();
        } else {
            // Set player's x-axis position to the right edge of the canvas
            player.xAxis = CANVAS_WIDTH - player.width;
        }
    }

    // Draw and update powerups
    powerupArray.forEach((power) => {
        if (power !== "") {
            power.draw(ctx);
            power.update(TILE_SIZE * 6);
        }
    });

    // Draw and update explosions, remove if necessary
    explosionArray.forEach((explosion) => {
        explosion.draw(ctx);
        explosion.update();
        if (explosion.removeExplosion) {
            explosionArray.splice(explosionArray.indexOf(explosion), 1);
        }
    });

    // Draw game map and update enemies
    gameMap.draw();
    updateEnemies();

    // Draw powerup block, player, and update bullets
    drawPowerUpBlock();
    playerRender();
    updateBullets(playerBullets);

    // Detect player movement and check collisions
    detectMovement();
    if (!player.isSpawning) {
        checkPlayerCollisions();
    }

    // Show special move if player has special bullets
    if (player.hasSpecialBullet) {
        showSpecialMove();
    }

    // Check enemy bullet and turret bullet collisions
    checkEnemyBulletCollision();
    turretBulletCollision();

    // Check powerup collision, display player health state and score
    checkPowerUpCollision(player);
    displayPlayerHealthState(player.lives);
    displayPlayerScore();

    // Upgrade difficulty and check if game is over
    upgradeDifficulty();
    const gameAnimation = requestAnimationFrame(render);
    if (isGameOver()) {
        gameAudio.pause();
        cancelAnimationFrame(gameAnimation);
        displayGameOverScreen();
    }
}

function updateGameMap() {
    playerBullets = [];
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


function updateEnemies() {
    enemiesArray.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update(player);
        if (enemy.canShoot) {
            updateBullets(enemy.bullets);
            if (checkPlayerInProximity(enemy)) enemy.shoot(player);
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

function shootBullet(xAxis, yAxis, direction) {
    let isSpecialBullet = false;
    if (player.hasSpecialBullet && inputs.special) {
        isSpecialBullet = true;
        player.specialBulletCount -= 1;
    }
    const bullet = new Bullet(xAxis, yAxis, direction, PLAYER_ID, isSpecialBullet, playerBullets);
    playerBullets.push(bullet);

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
    turretsArray.forEach((turret, turretIndex) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (detectRectCollision(turret, bullet)) {
                if (bullet.isSpecial) {
                    createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_SPECIAL);
                } else {
                    createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_NORMAL);
                }
                playAudio(gameAudios.metalHit);
                increaseScoreOnHit();
                turret.health -= bullet.damage;
                playerBullets.splice(bulletIndex, 1);
                if (turret.health <= 0) {
                    createExplosionEffect(turret.xAxis, turret.yAxis, EXPLOSION_SPECIAL);
                    increaseScoreOnTurretDestroyed();
                    turretsArray.splice(turretIndex, 1);
                }
            }
        });
    });
}
function checkPlayerBulletCollision() {
    enemiesArray.forEach(enemy => {
        if (enemy.canShoot) {
            enemy.bullets.forEach((bullet, bulletIndex) => {
                if (detectRectCollision(bullet, player)) {
                    enemy.bullets.splice(bulletIndex, 1);
                    respawnPlayerAfterHit();
                }
            })
        }
    })
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
        powerUp = POWERUP_SPECIAL;
    } else if (randomPowerUp < 4) {
        powerUp = POWERUP_MULTIPLIER;
    } else {
        powerUp = POWERUP_HEALTH;
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
                    powerupArray.push(new Powerups(powerupBlock.xAxis + TILE_SIZE, powerupBlock.yAxis, powerUp));
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

