export default class InputHandler {
    constructor() {
        this.keys = [];
        this.controlKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Enter"];

        window.addEventListener("keydown", (e) => {
            if (this.controlKeys.indexOf(e.key) > -1 && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
            console.log(e.key, this.keys);
        });

        window.addEventListener("keyup", (e) => {
            if (this.controlKeys.indexOf(e.key) > -1) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            console.log(e.key, this.keys);
        });

    }
}
