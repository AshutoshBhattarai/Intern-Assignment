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

    // Set the difficulty level based on the value stored in local storage, or use the default value if not found
    difficulty = localStorage.getItem('difficulty') || DIFFICULTY_EASY;

    // Initialize arrays to store player bullets, powerups, and explosions
    playerBullets = [];
    powerupArray = [];
    explosionArray = [];

    // Set the player's last bullet time to 0(not shot yet!!)
    playerLastBullet = 0;

    // Set the initial score to 0 and calculate the score multiplier based on the difficulty level
    score = 0;
    scoreMultiplier = difficulty === DIFFICULTY_MEDIUM ? SCORE_MULTIPLIER_MEDIUM : SCORE_MULTIPLIER_HARD;

    // Create a new GameMap
    gameMap = new GameMap(0, 0, ctx, mapIndex);

    // Generate the collision blocks array of the game map
    gameMap.createBlocksArray();

    // Set the enemies array, turrets array, and powerup block based on the game map
    enemiesArray = gameMap.enemies;
    turretsArray = gameMap.turrets;
    tanksArray = gameMap.tanks;
    powerupBlock = gameMap.powerupBlock;

    // Create the Player object with the specified parameters
    player = new Player(PLAYER_INITIAL_SPAWN_X, PLAYER_INITIAL_SPAWN_Y, ctx, gameMap.collisionBlocks);
}
function render() {
    gameMap.draw();
    // Check if player is out of bounds
    if (player.xAxis > gameMap.width) {
        // Check if there are no turrets and enemies
        if (checkMapClear()) {
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

    // Update enemies
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
    tankBulletCollision();

    // Check powerup collision, display player health state and score
    checkPowerUpCollision(player);
    displayPlayerHealthState(player.lives);
    displayPlayerScore();

    // Upgrade difficulty 
    upgradeDifficulty();
    const gameAnimation = requestAnimationFrame(render);
    //check if game is over
    if (isGameOver()) {
        // gameAudio.pause();
        cancelAnimationFrame(gameAnimation);
        displayGameOverScreen();
    }
}

function updateGameMap() {
    // Resetting Previous map section variables
    playerBullets = [];
    powerupArray = [];
    gameMap.enemies = [];
    // Creating new map section object
    gameMap = new GameMap(0, 0, ctx, mapIndex);
    gameMap.createBlocksArray();
    powerupBlock = gameMap.powerupBlock == undefined ? undefined : gameMap.powerupBlock;
    enemiesArray = gameMap.enemies;
    turretsArray = gameMap.turrets;
    tanksArray = gameMap.tanks;
    player.xAxis = 0;
    player.yAxis = getPlayerLastPosY();
    // updating player collision blocks(to detect collision...(???)) for the new map
    player.collisionBlocks = gameMap.collisionBlocks;
}


function updateEnemies() {
    // Draw and update enemies 
    enemiesArray.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update(player);
        if (enemy.canShoot) {
            updateBullets(enemy.bullets);
            if (checkPlayerInProximity(enemy)) enemy.shoot(player);
        }
    });
    // Draw and update turrets
    turretsArray.forEach(turret => {
        turret.draw(ctx);
        turret.calculateAngleToPlayer(player);
        turret.checkPlayerBulletCollision(player)
        turret.updateBullets();
        if (checkPlayerInProximity(turret)) {
            turret.shoot();
        }
    });
    // Draw and update tanks
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

// Checking player collison with enemy or their bullets
function checkPlayerCollisions() {
    checkEnemyPlayerCollision();
    checkPlayerBulletCollision();
}
// Get player's last y-axis position (to set it on the next map section)
function getPlayerLastPosY() {
    return player.yAxis;
}

// Updating player object on each render frame
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
// To progress to next section;
function checkMapClear() {
    if (enemiesArray.length == 0 && turretsArray.length == 0 && tanksArray.length == 0) {
        return true;
    }
    return false;
}

/* -------------------------------------------------------------------------- */
/*                              Collision Checks                              */
/* -------------------------------------------------------------------------- */
// Function works as a collision checker for player and enemies(they work as their names)

/* ----------- Checking if player collides with the running enemy ----------- */
// Not applicable for other types.
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
    if (horizontalDistance <= threshold) {
        return true;
    } else {
        return false;
    }
}

/* ------------------------- Display available lives ------------------------ */
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

/* ------------------- Display if you have special bullet ------------------- */
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
            //Increase life state by one if collect life powerup
            if (power.type == POWERUP_HEALTH) {
                player.lives += 1;
            }
            // Score multiplier if collect multiplier powerup(based on difficulty)
            if (power.type == POWERUP_MULTIPLIER) {
                score *= Math.ceil(difficulty == DIFFICULTY_EASY ? 1.25 : scoreMultiplier);
            }
            // Grant special bullet with increased damage
            if (power.type == POWERUP_SPECIAL) {
                player.hasSpecialBullet = true;
                player.specialBulletCount++;
            }
            // Remove powerup after player collects
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
// Is player dead or not ???
function isGameOver() {
    return player.isDead();
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
function increaseScoreOnTankDestroyed() {
    score += SCORE_TANK;
}
function decreaseScoreOnHit() {
    score -= SCORE_HIT * (difficulty == DIFFICULTY_EASY ? 1 : scoreMultiplier);
}
/* ----------------------------------- -- ----------------------------------- */
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
    // Generate a random number between 1 and 5
    const randomPowerUp = Math.round(generateRandomNumber(1, 5));
    // Generate a random number between 1 and 2 and check if it's even
    const shouldGeneratePowerUp = Math.round(generateRandomNumber(1, 2)) % 2 === 0;
    let powerUp;
    // Determine the type of power-up based on the random number generated
    if (randomPowerUp <= 3) {
        powerUp = POWERUP_SPECIAL;
    } else if (randomPowerUp == 4) {
        powerUp = POWERUP_MULTIPLIER;
    } else {
        powerUp = POWERUP_HEALTH;
    }
    playerBullets.forEach((bullet, index) => {
        // Check if the power-up block is open and there is a collision between the bullet and the block
        if (powerupBlock.isOpen && detectRectCollision(bullet, powerupBlock)) {
            metalHitSoundEffect();
            playerBullets.splice(index, 1);
            // Decrease the hit count of the power-up block
            powerupBlock.hit--;
            // Check if the power-up block has been hit enough times to generate a power-up
            if (powerupBlock.hit === 0) {
                // Check if the difficulty is hard or medium, if so a power-up should not be generated
                if ((difficulty === DIFFICULTY_HARD) && !shouldGeneratePowerUp) {
                    // Add an empty string to the powerupArray
                    powerupArray.push("");
                } else {
                    // Create a new power-up object and add it to the powerupArray
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

