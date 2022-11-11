window.addEventListener("load", function () {
  const canvas = /** @type {HTMLCanvasElement} */ (
    document.getElementById("canvas1")
  );
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 500);
  const CANVAS_HEIGHT = (canvas.height = 800);

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 100;
      this.enemyTimer = 0;
      this.enemyTipes = ["worm", "ghost"];
    }

    update(deltaTime) {
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => enemy.update(deltaTime));
      return this;
    }

    draw() {
      this.enemies.forEach((enemy) => enemy.draw());
    }

    #addNewEnemy() {
      const randomEnemy = this.enemyTipes[Math.floor(Math.random() * this.enemyTipes.length)]

      const enemyTypeEnum = {
        worm: Worm,
        ghost: Ghost
      }

      // e.g.: this.enemies.push(new Worm(this));
      this.enemies.push(new enemyTypeEnum[randomEnemy](this));
      this.enemies.sort((a, b) => a.y - b.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.width = 100;
      this.height = 100;
      this.markedForDeletion = false;
    }

    update(deltaTime) {
      this.x -= this.vx * deltaTime;

      if (this.x < 0 - this.width) this.markedForDeletion = true;
      return this;
    }

    draw() {
      ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.image = worm;
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth/2;
      this.height = this.spriteHeight/2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.image = ghost;
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth/2;
      this.height = this.spriteHeight/2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.vx = Math.random() * 0.2 + 0.1;
    }
  }

  const game = new Game(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
  let lastTime = 1;
  function animate(timestamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime).draw();

    requestAnimationFrame(animate);
  }

  animate(0);
});
