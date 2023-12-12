class Turret {
    constructor(xAxis, yAxis) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.angle = 0;
        this.health = 7;
        this.height = TILE_SIZE * 2;
        this.width = TILE_SIZE * 2;
        this.lastBulletTime = 0;
        this.bullets = [];
        this.bulletInterval = null;
        this.turretImage = new Image();
        this.bulletImage = new Image();
        this.turretImage.src = '../../assets/images/Contra-Tanks.gif'
        this.bulletImage.src = '../../assets/images/Contra-Extras.gif'
    }

    draw(ctx) {
        const { x, y, height, width } = tankSprites.initial;
        ctx.drawImage(this.turretImage, x, y, width, height, this.xAxis, this.yAxis, this.width, this.height);
        this.bullets.forEach(bullet => {
            // ctx.fillStyle = "red"
            // ctx.fillRect(bullet.x, bullet.y, 5, 5)
            const { x, y, height, width } = enemyBulletSprite;
            ctx.drawImage(this.bulletImage, x, y, height, width, bullet.xAxis + 20, bullet.yAxis + 20, bullet.width, bullet.height);
        });
    }
    calculateAngleToPlayer(player) {
        this.angle = Math.atan2(player.yAxis - this.yAxis, player.xAxis - this.xAxis);
    }

    checkPlayerBulletCollision(player) {
        this.bullets.forEach((bullet, index) => {
            if (detectRectCollision(player, bullet)) {
                this.bullets.splice(index, 1);
            }
        })
    }
    shoot() {
        const bulletSpeed = ENEMY_BULLET_SPEED;
        let currentTime = new Date();
        const canShoot = currentTime - this.lastBulletTime > BULLET_COOLDOWN;
        if (canShoot) {
            const bullet = {
                xAxis: this.xAxis,
                yAxis: this.yAxis,
                speed: bulletSpeed,
                height: 5,
                width: 5,
                angle : this.angle
            }
            this.bullets.push(bullet);
            this.lastBulletTime = currentTime;
        }
    }

    updateBullets() {
        this.bullets.forEach((bullet) => {
            bullet.xAxis += Math.cos(bullet.angle) * bullet.speed;
            bullet.yAxis += Math.sin(bullet.angle) * bullet.speed;
        });
        this.bullets = this.bullets.filter(bullet => bullet.xAxis >= 0
            && bullet.xAxis <= canvas.width
            && bullet.yAxis >= 0
            && bullet.yAxis <= canvas.height);
    }
}