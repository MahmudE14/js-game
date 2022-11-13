class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }

    update() {
        // 
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
        // 
    }
}

class FlyingEnemy extends Enemy {
    constructor() {
        // 
    }
}

class RunningEnemy extends Enemy {
    constructor() {
        // 
    }
}

class ClimbingEnemy extends Enemy {
    constructor() {
        // 
    }
}
