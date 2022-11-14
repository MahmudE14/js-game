import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import {
    FlyingEnemy,
    GroundEnemy,
    ClimbingEnemy,
} from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", function () {
    // loading.style.display = "none";

    const canvas = /** @type {HTMLCanvasElement} */ (
      document.getElementById("canvas1")
    );
    const ctx = canvas.getContext("2d");
    const CANVAS_WIDTH = (canvas.width = 500);
    const CANVAS_HEIGHT = (canvas.height = 500);

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 83;
            this.speed = 0;
            this.maxSpeed = 4;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = "black";
            this.time = 0;
            this.maxTime = 10000;
            this.gameOver = false;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
            this.time += deltaTime;
            if (this.time > this.maxTime) this.gameOver = true;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });

            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(0, this.maxParticles);
            }

            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1);
            })

            return this;
        }

        draw(/** @type {CanvasRenderingContext2D} */ context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.particles.forEach(particle => particle.draw(context));
            this.collisions.forEach(collision => collision.draw(context));
            this.UI.draw(context);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else this.enemies.push(new ClimbingEnemy(this));

            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
    let lastTime = 0;

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        game.update(deltaTime).draw(ctx);

        if (!game.gameOver) requestAnimationFrame(animate);
    }

    animate(0);
});
