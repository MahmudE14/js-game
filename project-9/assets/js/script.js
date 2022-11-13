import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import {
    FlyingEnemy,
    RunningEnemy,
    ClimbingEnemy,
} from "./enemies.js";

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
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 4;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler();
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
        }

        update(deltaTime) {
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

            return this;
        }

        draw(/** @type {CanvasRenderingContext2D} */ context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
        }

        addEnemy() {
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

        requestAnimationFrame(animate);
    }

    animate(0);
});
