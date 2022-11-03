const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];

class Raven {
    constructor() {
        this.width = 100;
        this.height = 50;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 + 2.5;
    }

    update() {
        this.x -= this.directionX;
        return this;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.fillRect(this.image, this.x, this.y, this.width, this.height, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}


function animate(timestamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
    }

    [...ravens].forEach(raven => raven.update().draw());

    requestAnimationFrame(animate)
}
// animate(0);
