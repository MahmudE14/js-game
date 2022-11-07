const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

// Collision Canvas
const collisionCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById('collisionCanvas'));
const collisionCanvasCtx = collisionCanvas.getContext('2d');
const collision_CANVAS_WIDTH = collisionCanvas.width = window.innerWidth;
const collision_CANVAS_HEIGHT = collisionCanvas.height = window.innerHeight;


let score = 0;
let gameOver = false;
ctx.font = "50px Impact"

let timeToNextRaven = 0;
let ravenInterval = 800;
let lastTime = 0;

let ravens = [];

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "./assets/images/raven.png";
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ]
        this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`
    }

    update(deltatime) {
        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height) {
            this.directionY = this.directionY * -1
        }
        
        this.x -= this.directionX;
        this.y += this.directionY;

        if (this.x < 0 - this.width) this.markedForDeletion = true;

        this.timeSinceFlap += deltatime;

        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;

            this.timeSinceFlap = 0;
        }

        if (this.x < 0 - this.width) gameOver = true;

        return this;
    }

    draw() {
        collisionCanvasCtx.fillStyle = this.color;
        collisionCanvasCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = "./assets/images/boom.png";
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = "./assets/sounds/boom.wav";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltatime) {
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true
        }
        return this;
    }

    draw() {
        // this.frame % 5 * this.spriteWidth
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 50, 75);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 52, 77);
}

function drawGameOver() {
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER, your score is " + score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER, your score is " + score, CANVAS_WIDTH/2 + 2, CANVAS_HEIGHT/2 + 2);
}

window.addEventListener("click", function (e) {
    const detectPixelColor = collisionCanvasCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pixelColor = detectPixelColor.data;
    ravens.forEach(raven => {
        // detect explosion by color
        if (raven.randomColors[0] === pixelColor[0] &&
            raven.randomColors[1] === pixelColor[1] &&
            raven.randomColors[2] === pixelColor[2]) {
            raven.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(raven.x, raven.y, raven.width));
            console.log(explosions);
        }
    })
});
 
function animate(timestamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort((a, b) => a.width - b.width)
    }

    drawScore();

    [...ravens, ...explosions].forEach(raven => raven.update(deltatime).draw());
    ravens = ravens.filter(raven => !raven.markedForDeletion);

    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);
