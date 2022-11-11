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
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTipes = ["worm", "ghost", "spider"];
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
      this.enemies.forEach((enemy) => enemy.draw(this.ctx));
    }

    #addNewEnemy() {
      const randomEnemy =
        this.enemyTipes[Math.floor(Math.random() * this.enemyTipes.length)];
      const enemyTypeEnum = {
        worm: Worm,
        ghost: Ghost,
        spider: Spider,
      };
      // e.g.: this.enemies.push(new Worm(this));
      this.enemies.push(new enemyTypeEnum[randomEnemy](this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX;
      this.maxFrame = 5;
      this.framInterval = 100;
      this.frameTimer = 0;
    }

    update(deltaTime) {
      this.x -= this.vx * deltaTime;

      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameTimer > this.framInterval) {
        this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      return this;
    }

    draw() {
      ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.image = worm;
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.image = ghost;
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.vx = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.04;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      return this;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      super.draw(ctx);
      ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.image = spider;
      this.spriteWidth = 310;
      this.spriteHeight = 175;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = Math.random() * this.game.width;
      this.y = 0 - this.height;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * game.height;
    }

    update(deltaTime) {
      super.update(deltaTime);
      this.y += this.vy * deltaTime;

      if (this.y > this.maxLength) this.vy *= -1;
      if (this.y < 0 - this.height) this.markedForDeletion = true;
    }

    // draw(ctx) {
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, 0);
        ctx.lineTo(this.x + this.width/2, this.y + 10);
        ctx.stroke();
        super.draw(ctx);
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
