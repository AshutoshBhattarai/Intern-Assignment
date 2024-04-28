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
let tanksArray;
let explosionArray;
let player;
let powerupArray;
let powerupBlock;
let gameAudio;


/* ------ Initialize the game variables to their initial/default values ----- */
function init() {
    // Set the initial map index/section
    mapIndex = 0;
    // Play the game music(Removed as it was annoying😁)
    // gameAudio = new Audio(gameAudios.gameMusic);
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
    tanksArray = gameMap.tanks;
    powerupBlock = gameMap.powerupBlock;

    player = new Player(PLAYER_INITIAL_SPAWN_X, PLAYER_INITIAL_SPAWN_Y, ctx, gameMap.collisionBlocks);
}

function render() {
    gameMap.draw();
    // Check if player is out of bounds
    if (player.xAxis > gameMap.width) {
        // Check if there are no turrets and enemies
        if (checkMapClear()) {
            if (mapIndex >= MAP_SECTION_ARRAY.length - 1) {
                mapIndex = Math.round(generateRandomNumber(3, 6));
            }
            mapIndex++;
            increaseScoreOnDistance();
            updateGameMap();
        } else {
            player.xAxis = CANVAS_WIDTH - player.width;
        }
    }

    powerupArray.forEach((power) => {
        if (power !== "") {
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
    });

    updateEnemies();

    drawPowerUpBlock();
    playerRender();
    updateBullets(playerBullets);

    detectMovement();
    if (!player.isSpawning) {
        checkPlayerCollisions();
    }

    if (player.hasSpecialBullet) {
        showSpecialMove();
    }

    checkEnemyBulletCollision();
    turretBulletCollision();
    tankBulletCollision();

    checkPowerUpCollision(player);
    displayPlayerHealthState(player.lives);
    displayPlayerScore();

    upgradeDifficulty();


    const gameAnimation = requestAnimationFrame(render);
    if (isGameOver()) {
        cancelAnimationFrame(gameAnimation);
        displayGameOverScreen();
    }
}

function updateGameMap() {
    // Resetting Previous map section variables
    playerBullets = [];
    powerupArray = [];
    gameMap.enemies = [];

    gameMap = new GameMap(0, 0, ctx, mapIndex);
    gameMap.createBlocksArray();
    powerupBlock = gameMap.powerupBlock == undefined ? undefined : gameMap.powerupBlock;
    enemiesArray = gameMap.enemies;
    turretsArray = gameMap.turrets;
    tanksArray = gameMap.tanks;
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
    });

    tanksArray.forEach((tank) => {
        tank.draw(ctx);
        tank.update();
        tank.updateCannons();
        tank.checkCannonPlayerCollision(player);
        if (tank.isUp) {
            tank.shootCannon(player);
        }
    })
}

function checkPlayerCollisions() {
    checkEnemyPlayerCollision();
    checkPlayerBulletCollision();
}
// Get player's last y-axis position (to set it on the next map section)
function getPlayerLastPosY() {
    return player.yAxis;
}

function playerRender() {
    player.draw();
    player.update();
    player.checkBoundary();
}


/* -------------------------------------------------------------------------- */
/*                            Player shooting logic                           */
/* -------------------------------------------------------------------------- */
function detectMovement() {
    const currentTime = Date.now();
    const bulletX = player.isFacing === DIRECTION_RIGHT ? player.xAxis + player.width : player.xAxis;
    const canShoot = currentTime - playerLastBullet > BULLET_COOLDOWN;
    const from = PLAYER_ID
    if (inputs.shoot && canShoot) {
        player.velX = 0;
        playAudio(gameAudios.playerGun);
        if (inputs.down && !inputs.left && !inputs.right) {
            shootBullet(bulletX, player.yAxis + player.height * 2 / 4, player.isFacing, from);
            playerLastBullet = currentTime;
        }
        if (!inputs.up && !inputs.down) {
            shootBullet(bulletX, player.yAxis + player.height / 3, player.isFacing, from);
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
        playAudio(gameAudios.specialBullet);
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
/* ----------------------------------- -- ----------------------------------- */

/* --------------------- Checking if map is clear or not -------------------- */
function checkMapClear() {
    return (enemiesArray.length == 0 && turretsArray.length == 0 && tanksArray.length == 0)
}

/* -------------------------------------------------------------------------- */
/*                              Collision Checks                              */
/* -------------------------------------------------------------------------- */

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
/* ----------------- Checking if player's bullet hits enemy ----------------- */
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
/* ------------------ Checking if player's bullet hits turrets ----------------- */
function turretBulletCollision() {
    turretsArray.forEach((turret, turretIndex) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (detectRectCollision(turret, bullet)) {
                if (bullet.isSpecial) {
                    createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_SPECIAL);
                } else {
                    createExplosionEffect(bullet.xAxis, bullet.yAxis, EXPLOSION_NORMAL);
                }
                metalHitSoundEffect();
                increaseScoreOnHit();
                turret.health -= bullet.damage;
                playerBullets.splice(bulletIndex, 1);
                if (turret.health <= 0) {
                    createExplosionEffect(turret.xAxis, turret.yAxis, EXPLOSION_SPECIAL);
                    increaseScoreOnTurretDestroyed();
                    explosionSoundEffect();
                    turretsArray.splice(turretIndex, 1);
                }
            }
        });
    });
}
/* ------------------ Checking if player's bullet hits tanks ----------------- */
function tankBulletCollision() {
    tanksArray.forEach((tank, tankIndex) => {
        playerBullets.forEach((bullet, bulletIndex) => {
            if (detectRectCollision(tank, bullet)) {
                const explosionType = bullet.isSpecial ? EXPLOSION_SPECIAL : EXPLOSION_NORMAL;
                createExplosionEffect(bullet.xAxis, bullet.yAxis, explosionType);
                metalHitSoundEffect();
                increaseScoreOnHit();
                tank.health -= bullet.damage;
                playerBullets.splice(bulletIndex, 1);
                if (tank.health <= 0) {
                    tank.isUp = false;
                    increaseScoreOnTankDestroyed();
                    playAudio(gameAudios.shutDown);
                    setTimeout(() => {
                        createExplosionEffect(tank.xAxis, tank.yAxis, EXPLOSION_SPECIAL);
                        explosionSoundEffect();
                        tanksArray.splice(tankIndex, 1);
                    }, 1000);
                }
            }
        });
    });
}
/* -------------- Checking if player got hit by enemy's bullet -------------- */
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

/* ----------------------------- Proximity check ---------------------------- */
function checkPlayerInProximity(enemy) {
    const threshold = difficulty == DIFFICULTY_EASY ? CANVAS_WIDTH / 2 : CANVAS_WIDTH;
    // Calculating the horizontal distance between player and enemy using their X-axis Coords.
    const horizontalDistance = Math.abs(player.xAxis - enemy.xAxis);
    // Checking if the distance is less than or equal to threshold value (in pixel)
    return horizontalDistance <= threshold
}

/* ------------------------- Display available lives ------------------------ */
function displayPlayerHealthState(healthLeft) {
    let image = new Image();
    let { x, y, height, width } = healthDisplaySprite;
    image.src = './assets/images/Contra-Extras.gif';

    for (let i = 1; i <= healthLeft; i++) {
        ctx.drawImage(image, x, y, width, height, i * 20, 50, 50, 50);
    }
}

/* ------------------- Display if you have special bullet ------------------- */
function showSpecialMove() {
    let image = new Image();
    let { x, y, height, width } = powerupSprite.specialMove;
    image.src = './assets/images/Contra-Extras.gif';

    let gap = 50;
    for (let i = 1; i <= player.specialBulletCount; i++) {
        ctx.drawImage(image, x, y, width, height, CANVAS_WIDTH - gap, 50, 50, 50);
        gap += 50;
    }
}

/* -------------------------- Display current score ------------------------- */
function displayPlayerScore() {
    ctx.font = "20px VT323";
    ctx.fillStyle = "white"
    ctx.fillText("Score: " + score, 20, 50);
}

/* -------------------------------------------------------------------------- */
/*                           Powerup collection logic                         */
/* -------------------------------------------------------------------------- */
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

/* ------------- Function to respawn the player after being hit ------------- */
function respawnPlayerAfterHit() {
    const { x, y } = gameMap.getPlayerReSpawnPosition();
    playerHitSoundEffect();
    decreaseScoreOnHit();
    player.playerHit();
    player.playerReSpawn(x, y);
}

function isGameOver() {
    return player.isDead();
}


/* -------------------------------------------------------------------------- */
/*                             Score Manipulation                             */
/* -------------------------------------------------------------------------- */
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
function increaseScoreOnTankDestroyed() {
    score += SCORE_TANK;
}
function decreaseScoreOnHit() {
    score -= SCORE_HIT * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}


/* -------------------------- Sound effects section ------------------------- */
function playerHitSoundEffect() {
    playAudio(gameAudios.playerHit);
}
function enemyHitSoundEffect() {
    playAudio(gameAudios.enemyHit);
}
function explosionSoundEffect() {
    playAudio(gameAudios.explosion);
}
function metalHitSoundEffect() {
    playAudio(gameAudios.metalHit);
}
/* ------------------------- Powerup blocks section ------------------------- */
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

    if (randomPowerUp <= 3) {
        powerUp = POWERUP_SPECIAL;
    } else if (randomPowerUp == 4) {
        powerUp = POWERUP_MULTIPLIER;
    } else {
        powerUp = POWERUP_HEALTH;
    }


    playerBullets.forEach((bullet, index) => {
        if (powerupBlock.isOpen && detectRectCollision(bullet, powerupBlock)) {
            metalHitSoundEffect();
            playerBullets.splice(index, 1);

            powerupBlock.hit--;

            if (powerupBlock.hit === 0) {
                if ((difficulty === DIFFICULTY_HARD) && !shouldGeneratePowerUp) {
                    powerupArray.push("");
                } else {
                    powerupArray.push(new Powerups(powerupBlock.xAxis + TILE_SIZE, powerupBlock.yAxis, powerUp));
                }
            }
        }
    });
}

/* ------- Upgrading the difficulty if the game is getting to easy :) ------- */
function upgradeDifficulty() {
    const EASY_THRESHOLD = 10000;
    const MEDIUM_THRESHOLD = 30000;
    if (difficulty == DIFFICULTY_EASY && score >= EASY_THRESHOLD) {
        difficulty = DIFFICULTY_MEDIUM;
        localStorage.setItem('difficulty', difficulty);
    } else if (difficulty == DIFFICULTY_MEDIUM && score >= MEDIUM_THRESHOLD) {
        difficulty = DIFFICULTY_HARD;
        localStorage.setItem('difficulty', difficulty);
    }
}

/* -------------------------------------------------------------------------- */
/*                         !!!!! Creating BOoom !!!!                          */
/* -------------------------------------------------------------------------- */
function createExplosionEffect(x, y, type) {
    const explosion = new Explosion(x, y, type);
    explosionArray.push(explosion);
}

