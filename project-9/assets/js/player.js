import {
    Sitting,
    Running,
    Jumping,
    Falling,
    Rolling,
    Diving,
    Hit
} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        // fps control
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        // consume state
        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ];
        this.currentState = null;
    }

    update(/** @type {Array} */ input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);

        // horizontal movement
        this.x += this.speed;
        // if user not in the state of hit move left and right on left/right arrow key press
        if (input.includes("ArrowRight") && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes("ArrowLeft") && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;

        // horizontal bounderies
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movememt
        this.y += this.vy;
        this.vy = !this.onGround() ? this.vy + this.weight : 0;

        // vertical bounderies
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(
            this.image,
            this.frameX * this.width,
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
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(/** @type {Number} */ state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            // check collision
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        enemy.x + enemy.width * 0.5,
                        enemy.y + enemy.height * 0.5
                    )
                )

                // add score if rolling or diving, else got hit
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    this.game.floatingMessages.push(
                        new FloatingMessage("+1", enemy.x, enemy.y, 120, 50)
                    );
                } else {
                    this.game.lives--;
                    this.game.score -= 5;
                    this.game.floatingMessages.push(
                        new FloatingMessage("-5", enemy.x, enemy.y, 120, 50)
                    );
                    this.setState(6, 0);
                    if (this.game.lives <= 0) this.game.gameOver = true;
                    if (this.game.score <= 0) this.game.gameOver = true;
                }

            }
        });
    }
}
