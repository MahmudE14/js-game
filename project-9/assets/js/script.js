import Player from "./player.js"
import InputHandler from "./input.js"

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
            this.player = new Player(this);
            this.input = new InputHandler();
        }

        update() {
            this.player.update(this.input.keys);
            return this;
        }

        draw(/** @type {CanvasRenderingContext2D} */ context) {
            this.player.draw(context);
        }
    }

    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    function animate(timestamp) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        game.update().draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});
