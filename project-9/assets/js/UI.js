export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Helvetica";
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        // context.textAlign = "center";
        context.fillStyle = this.game.fontColor;

        // score
        context.fillText("Score: " + this.game.score, 20, 50);
    }
}
