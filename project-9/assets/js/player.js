import {
    Sitting,
    Running,
    Jumping,
    Falling,
} from "./playerStates.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [
            new Sitting(this),
            new Running(this),
            new Jumping(this),
            new Falling(this),
        ];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    update(/** @type {Array} */ input, deltaTime) {
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        if (input.includes("ArrowRight")) this.speed = this.maxSpeed;
        else if (input.includes("ArrowLeft")) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movememt
        this.y += this.vy;
        this.vy = !this.onGround() ? this.vy + this.weight : 0;

        // sprite animation
        // this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
        context.drawImage(
            this.image,
            this.frameX * this.weight,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    onGround() {
        return this.y >= this.game.height - this.height;
    }

    setState(/** @type {Number} */ state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}
