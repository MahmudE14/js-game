class GameLevel {
    constructor(game) {
        this.game = game;
        this.settings = {
            CITY: {
                background: 'city',
                gameMargin: 83,
            },
            FOREST: {
                background: 'forest',
                gameMargin: 40,
            }
        };
    }

    setup(level) {
        this.game.level = level;
        this.game.gameMargin = this.settings[level].groundMargin;

        for (let i = 1; i <= 5; i++) {
            this.#setBackgroundImage(i, this.settings[level].background);
        }

    }

    #setBackgroundImage(index, level) {
        this.game.background['layer' + index + 'image'] = "./assets/images/" + this.settings[level].background + "/layer-" + index + ".png";
    }
}
