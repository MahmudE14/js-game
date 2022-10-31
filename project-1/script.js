let playerState = "run";
const dropdown = document.getElementById('animations');
dropdown.addEventListener("change", function(e) {
    playerState = e.target.value;
});

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
/**
 * @note
 * sprite sheet width is 6876px
 * and total column is 12
 * so sprite width is 6876/12 = 573
 * 
 * taking margin and padding (/empty space surrounding the image)
 *  into accout, it is 575
 */
const spriteWidth = 575;

/**
 * @note
 * sprite sheet height: 5230px
 * total rows: 10
 * sprite height: 5230/10 = 523
 */
const spriteHeight = 523;

let gameFrame = 0;
const staggerFrames = 5;
const spriteAnimations = [];
const animationStates  = [
    {
        name: 'idle',
        frames: 7
    },
    {
        name: 'jump',
        frames: 7
    },
    {
        name: 'fall',
        frames: 7
    },
    {
        name: 'run',
        frames: 9
    },
    {
        name: 'dizzy',
        frames: 11
    },
    {
        name: 'sit',
        frames: 5
    },
    {
        name: 'roll',
        frames: 7
    },
    {
        name: 'bite',
        frames: 7
    },
    {
        name: 'ko',
        frames: 12
    },
    {
        name: 'getHit',
        frames: 4
    },
];

animationStates.forEach((state, index) => {
    let frames = {
        loc: []
    }

    for (let i = 0; i < state.frames; i++) {
        const positionX = i * spriteWidth;
        const positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }

    spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight); // param_count: (3 | 5 | 9)

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
