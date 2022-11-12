window.addEventListener("load", function () {
  const canvas = /** @type {HTMLCanvasElement} */ (
    document.getElementById("canvas1")
  );
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 800);
  const CANVAS_HEIGHT = (canvas.height = 720);
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      this.controlKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

      window.addEventListener("keydown", (e) => {
        if (
          this.controlKeys.indexOf(e.key) > -1 &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });

      window.addEventListener("keyup", (e) => {
        if (this.controlKeys.indexOf(e.key) > -1) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.spriteWidth = 0;
      this.spriteHeight = 0;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = playerImage;
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      this.input = [];
    }

    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
        const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width/2 + this.width/2) {
          gameOver = true;
        }
      });

      // sprite animations
      if (this.frameTimer > this.frameInterval) {
        this.frameX = this.frameX >= this.maxFrame ? 0 : this.frameX + 1;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      // controls
      this.input = input;
      if (input.keys.indexOf("ArrowRight") > -1) {
        // if (this.keyPressed('ArrowRight')) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy = -30;
      } else {
        this.speed = 0;
      }

      // horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }

      // ground limit
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;

      return this;
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.beginPath();
      context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
      context.stroke();

      context.strokeStyle = "blue";
      context.beginPath();
      context.arc(this.x, this.y, this.width/2, 0, Math.PI*2);
      context.stroke();

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
      return this.y >= this.gameHeight - this.height;
    }

    keyPressed(key) {
      return this.input.keys.length && this.input.keys.indexOf(key) > -1;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = backgroundImage;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 7;
    }

    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
      return this;
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - 2,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = enemyImage;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.speed = 8;
      this.markedForDeletion = false;
    }

    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        this.frameX = this.frameX >= this.maxFrame ? 0 : this.frameX + 1;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }

      this.x -= this.speed;

      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        score++;
      }
      return this;
    }

    draw(/** @type {CanvasRenderingContext2D} */ context) {
      context.strokeStyle = "white";
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.beginPath();
      context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
      context.stroke();

      context.strokeStyle = "blue";
      context.beginPath();
      context.arc(this.x, this.y, this.width/2, 0, Math.PI*2);
      context.stroke();

      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT));
      enemyTimer = 0;
      randomEnemyInterval = Math.random() * 1000 + 500;
    } else {
      enemyTimer += deltaTime;
    }

    enemies.forEach(enemy => enemy.update(deltaTime).draw(ctx));
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
  }

  function displayStatusText(/** @type {CanvasRenderingContext2D} */ context) {
    context.font = "40px Helvetica";
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 22, 52);

    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText("Game Over, Try again", CANVAS_WIDTH/2, 200);
      context.fillStyle = "white";
      context.fillText("Game Over, Try again", CANVAS_WIDTH/2 + 2, 200 + 2);
    }
  }

  const input = new InputHandler();
  const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
  const background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // background.update().draw(ctx);
    background.draw(ctx);
    player.update(input, deltaTime, enemies).draw(ctx);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});
