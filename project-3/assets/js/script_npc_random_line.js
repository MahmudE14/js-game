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
        this.image.src = imageBaseURL + 'enemy3.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 3;
        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.x = CANVAS_WIDTH/2 * Math.sin(this.angle * Math.PI/90) + (CANVAS_WIDTH/2 - this.width/2);
        this.y = CANVAS_HEIGHT/2 * Math.cos(this.angle * Math.PI/180) + (CANVAS_HEIGHT/2 - this.height/2);
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
