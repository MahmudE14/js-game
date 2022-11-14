export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.controlKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Enter"];

        window.addEventListener("keydown", (e) => {
            if (this.controlKeys.indexOf(e.key) > -1 && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === "d") this.game.debug = !this.game.debug;
        });

        window.addEventListener("keyup", (e) => {
            if (this.controlKeys.indexOf(e.key) > -1) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            // else if (e.key === "d") this.game.debug = !this.game.debug;
        });

    }
}
