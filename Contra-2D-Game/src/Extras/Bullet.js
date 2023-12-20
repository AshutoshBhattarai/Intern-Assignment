class Bullet {
    constructor(xAxis, yAxis, direction, from, isSpecial, bulletArray) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.direction = direction;
        this.isSpecial = isSpecial;
        this.from = from;
        this.bulletArray = bulletArray || [];
        this.width = BULLET_RADIUS * 2;
        this.height = BULLET_RADIUS * 2;
        this.animationTimer = 0;
        this.damage = this.isSpecial ? SPECIAL_BULLET_DAMAGE : BULLET_DAMAGE;
        this.bulletSpeed = this.from == PLAYER_ID ? BULLET_SPEED : ENEMY_BULLET_SPEED;
        this.bulletImage = new Image();
        this.bulletImage.src = './assets/images/Contra-Extras.gif'
        if (difficulty != DIFFICULTY_EASY) {
            this.bulletSpeed = (difficulty == DIFFICULTY_MEDIUM && this.from == ENEMY_SOLDIER) ? (ENEMY_BULLET_SPEED + 1) : (ENEMY_BULLET_SPEED + 2);
        }
        this.specialBulletFrame = 0;
    }

    draw(ctx) {
        if (this.from == PLAYER_ID && this.isSpecial) {
            const { x, y, height, width } = bulletSprite.specialFire[this.specialBulletFrame];
            ctx.drawImage(this.bulletImage, x, y, height, width, this.xAxis, this.yAxis, 30, 30);
        }
        else {
            const { x, y, height, width } = this.from === ENEMY_SOLDIER ? bulletSprite.enemy : bulletSprite.player;
            ctx.drawImage(this.bulletImage, x, y, height, width, this.xAxis, this.yAxis, this.width, this.height);
        }
    }

    update() {
        this.basicBulletMovement();
        if (this.isSpecial) this.animateSpecialBullet();
        if (this.isOutOfBounds()) {
            this.removeBullet(this.bulletArray);
        }
    }
    basicBulletMovement() {
        // Shooting bullet in specified direction
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.xAxis += this.bulletSpeed;
                break;
            case DIRECTION_LEFT:
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_UP:
                this.yAxis -= this.bulletSpeed;
                break;
            case DIRECTION_DOWN:
                this.yAxis += this.bulletSpeed;
                break;
            case DIRECTION_DOWN_LEFT:
                this.yAxis += this.bulletSpeed;
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_DOWN_RIGHT:
                this.yAxis += this.bulletSpeed;
                this.xAxis += this.bulletSpeed;
                break;
            case DIRECTION_UP_LEFT:
                this.yAxis -= this.bulletSpeed;
                this.xAxis -= this.bulletSpeed;
                break;
            case DIRECTION_UP_RIGHT:
                this.yAxis -= this.bulletSpeed;
                this.xAxis += this.bulletSpeed;
                break;
        }
    }

    isOutOfBounds() {
        const { xAxis, yAxis } = this;
        const { width, height } = canvas;
        return xAxis > width || xAxis < 0 || yAxis > height - 40 || yAxis < 0;
    }
    removeBullet() {
        const bulletIndex = this.bulletArray.indexOf(this);
        if (bulletIndex !== -1) {
            this.bulletArray.splice(bulletIndex, 1);
        }
    }
    animateSpecialBullet() {
        this.animationTimer++;
        // 7 is used to control the animation speed of the bullet
        if (this.animationTimer % 7 == 0 && this.animationTimer != 0) {
            this.specialBulletFrame++;
            if (this.specialBulletFrame >= bulletSprite.specialFire.length) {
                this.specialBulletFrame = 0;
            }
        }

    }
}