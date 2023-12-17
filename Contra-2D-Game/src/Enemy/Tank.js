class Tank {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.height = TANK_HEIGHT / 3;
        this.width = TANK_WIDTH;
        this.isUp = false;
        this.frame = 0;
        this.state = tankSprites.new[this.frame];
        this.animationTimer = 0;
        this.health = TANK_HEALTH;
        this.cannonRadius = TANK_CANNON_RADIUS;
        this.cannonDiameter = this.cannonRadius * 2;
        this.activeCannons = [];
        this.cannonCount = 0;
        this.cannonSpeed = CANNON_SPEED;
        this.tankImage = new Image();
        this.cannonImage = new Image();
        this.cannonImage.src = './assets/images/Contra-Extras.gif';
        this.tankImage.src = './assets/images/Contra-Tanks.gif';
        this.cannon = bulletSprite.tankCannon;
    }

    draw(ctx) {
        const { x, y, height, width } = this.state;
        ctx.drawImage(this.tankImage, x, y, width, height, this.xAxis, this.yAxis, this.width, this.height);
        this.activeCannons.forEach(cannon => {
            const { x, y, height, width } = this.cannon;
            ctx.drawImage(this.cannonImage, x, y, width, height, cannon.xAxis, cannon.yAxis, this.cannonDiameter, this.cannonDiameter);
        })
    }
    update() {
        if (!this.isUp) {
            this.animationTimer++;
            if (this.animationTimer % 50 == 0) {
                this.frame++;
                this.height = TANK_HEIGHT;
                this.width = TANK_WIDTH;
                this.state = tankSprites.new[this.frame];
            }
            if (this.frame >= tankSprites.new.length - 1) {
                this.isUp = true;
                this.animationTimer = 0;
                this.state = tankSprites.new[2];
            }
        }
        if (this.isUp && this.health == TANK_HEALTH / 2) {
            this.state = tankSprites.hit;
            playAudio(gameAudios.powerDown);
        }
        if (this.isUp && this.health == TANK_HEALTH / 3) this.state = tankSprites.destroyed[2];
    }
    shootCannon(player) {
        const angle = Math.atan2(player.yAxis - this.yAxis, player.xAxis - this.xAxis);
        if (this.activeCannons.length <= 0) {
            const cannon = {
                xAxis: this.xAxis - 10,
                yAxis: this.yAxis + 30,
                angle: angle,
                height: this.cannonDiameter,
                width: this.cannonDiameter,
                speed: this.cannonSpeed,
            }
            this.activeCannons.push(cannon);
            this.cannonCount++;
            if (this.cannonCount % 5 == 0 && this.cannonCount != 0) this.cannonSpeed++;
        }
    }
    updateCannons() {

        this.activeCannons = this.activeCannons.filter(cannon =>
            cannon.xAxis >= 0 && cannon.xAxis <= canvas.width &&
            cannon.yAxis >= 0 && cannon.yAxis <= canvas.height
        );
        // Update the position of each bullet
        this.activeCannons.forEach(cannon => {
            cannon.xAxis += Math.cos(cannon.angle) * cannon.speed;
            cannon.yAxis += Math.sin(cannon.angle) * cannon.speed;
        });
    }

    checkCannonPlayerCollision(player) {
        this.activeCannons.forEach((cannon, cannonIndex) => {
            if (!player.isSpawning) {
                if (detectRectCollision(player, cannon)) {
                    this.activeCannons.splice(cannonIndex, 1);
                    respawnPlayerAfterHit()
                }
            }
        })
    }
}