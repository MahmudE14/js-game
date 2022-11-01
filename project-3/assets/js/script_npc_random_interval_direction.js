const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 960;
const numberOfEnemies = 10;
const enemies = [];
let gameFrame = 0;
const imageBaseURL = './assets/images/'

class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = imageBaseURL + 'enemy4.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 3;
        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.newX = Math.random() * (CANVAS_WIDTH - this.width);
        this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.interval = Math.floor(Math.random() * 200 + 50);
    }

    update() {
        if (gameFrame % this.interval === 0) { 
            this.newX = Math.random() * (CANVAS_WIDTH - this.width);
            this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
        }

        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/70;
        this.y -= dy/70;

        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) this.x = CANVAS_WIDTH;

        // change sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame = this.frame >= 5 ? 0 : this.frame + 1;
        }

        return this;
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        return this;
    }
}

for (let i = 0; i < numberOfEnemies; i++) {
    enemies.push(new Enemy())
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enemies.forEach(enemy => enemy.update().draw());
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
