// --- Global Variables ---
let playerHealth = 100;
const maxHealth = 100;

let playerXP = 0;
let playerLvlMaxXP = 100;


// --- Element Selections ---
// Thanks to 'defer', we can safely do this at the top level.
const healthBarFill = document.getElementById("healthBarFill");

const xpBarFill = document.getElementById("xpBarFill");

// It's still good practice to check if the element was found.
if (!healthBarFill) {
    console.error("Critical Error: Could not find element with ID 'healthBarFill'. Check your HTML for typos.");
}


// --- Functions ---

/**
 * Updates the health bar's visual width based on playerHealth.
 */
function updateHealthBar() {
    // Make sure we don't try to update a missing element.
    if (!healthBarFill) return;

    const healthPercentage = (playerHealth / maxHealth) * 100;

    // Set the width of the inner fill div.
    healthBarFill.style.width = Math.max(0, healthPercentage) + '%';

    if (playerHealth <= 30) {
    healthBarFill.style.backgroundColor = "red";
    } else if (playerHealth <= 60) {
        healthBarFill.style.backgroundColor = "orange";
    } else {
        healthBarFill.style.backgroundColor = "green";
    }

}


/**
 * A function to simulate taking damage.
 * @param {number} amount - The amount of damage to take.
 */
function takeDamage(amount) {
    playerHealth -= amount;

    // Ensure health doesn't go below 0.
    if (playerHealth < 0) {
        playerHealth = 0;
    }

    console.log("Player health: ", playerHealth);
    updateHealthBar(); // Call the update function.
}


// --- Initialization and Game Loop ---

// Set the initial visual state of the health bar.
updateHealthBar();

// Example: Make the player take 10 damage every 2 seconds.
setInterval(() => {
    if (playerHealth > 0) {
        takeDamage(10);
    }
}, 2000);


function gainXP(amount) {
    playerXP += amount;

    if (playerXP >= playerLvlMaxXP) {
        playerXP -= playerLvlMaxXP;   // carry leftover XP
        playerLvlMaxXP = Math.floor(playerLvlMaxXP * 1.5);
    }


    console.log("Player XP: ", playerXP);
    updateXPBar();
}

function updateXPBar() {
    // Make sure we don't try to update a missing element.
    if (!xpBarFill) return;

    //adding XP Bar functions
    const xpPercentage = (playerXP / playerLvlMaxXP) * 100;

    // Set the width of the inner fill div.
    xpBarFill.style.width = Math.max(0, xpPercentage) + '%';

}

// Example: Make the player take 10 damage every 2 seconds.
setInterval(() => {
        gainXP(10);
}, 2000);

updateXPBar();

// Player sprite

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;

const playerElement = document.getElementById("player");

function setPlayerFrame(row, col) {
    const x = col * FRAME_WIDTH;
    const y = row * FRAME_HEIGHT;
    playerElement.style.backgroundPosition = `-${x}px -${y}px`;
}

setPlayerFrame(0, 0); // row 0, col 0 (idle down)

const IDLE_DOWN = [0, 0];
const IDLE_LEFT = [1, 0];
const IDLE_RIGHT = [2, 0];
const IDLE_UP = [3, 0];

const IDLE_FRAMES = {
    down: 12,
    left: 12,
    right: 12,
    up: 4   // ← this one is slower
};

const IDLE_SPEED = {
    down: 100,
    left: 100,
    right: 100,
    up: 400   // ← 3× slower (150 × 3)
};

let lastIdleTime = 0;
let idleRow = 0;
let idleFrame = 0;

function updateIdleAnimation(timestamp) {
    const dir = ["down", "left", "right", "up"][idleRow];
    const frameCount = IDLE_FRAMES[dir];
    const speed = IDLE_SPEED[dir];

    if (timestamp - lastIdleTime >= speed) {
        idleFrame = (idleFrame + 1) % frameCount;
        setPlayerFrame(idleRow, idleFrame);
        lastIdleTime = timestamp;
    }
}


function setIdleDirection(direction) {
    let newRow = idleRow;

    if (direction === "up")    newRow = 3;
    if (direction === "left")  newRow = 1;
    if (direction === "right") newRow = 2;
    if (direction === "down")  newRow = 0;

    // Only reset if direction actually changed
    if (newRow !== idleRow) {
        idleRow = newRow;
        idleFrame = 0;          // reset animation frame
        lastIdleTime = 0;       // reset animation timer
        setPlayerFrame(idleRow, idleFrame); // update immediately
    }
}


let playerX = 300; // starting pixel position
let playerY = 300;
const playerSpeed = 4;

//setIdleDirection(lastDirection);

setPlayerFrame(...IDLE_DOWN);


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener("keydown", (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

let cameraX = 0;
let cameraY = 0;

function gameLoop(timestamp) {
    let moving = false;

    if (keys.ArrowUp || keys.w) {
        playerY -= playerSpeed;
        setIdleDirection("up");
        moving = true;
    }
    if (keys.ArrowDown || keys.s) {
        playerY += playerSpeed;
        setIdleDirection("down");
        moving = true;
    }
    if (keys.ArrowLeft || keys.a) {
        playerX -= playerSpeed;
        setIdleDirection("left");
        moving = true;
    }
    if (keys.ArrowRight || keys.d) {
        playerX += playerSpeed;
        setIdleDirection("right");
        moving = true;
    }

    // CAMERA FOLLOWS PLAYER
    cameraX = playerX - window.innerWidth / 2;
    cameraY = playerY - window.innerHeight / 2;

    background.style.left = -cameraX + "px";
    background.style.top = -cameraY + "px";

    // IDLE ANIMATION
    updateIdleAnimation(timestamp);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


// Ground tiles

// Lb = Large Break, Mb = Medium Break, Sb = Small Break, Vlb = Very Large Break
// Lt = Left, Rt = Right
// G = Ground
// W = Wall
// Tp = Top
// Bt = Bottom
// 32 = 32px hight
// Dg = Dungeon
const groundSprites = {
    tpGDg: {x: 0, y: 0, w: 64, h: 16},
    btGDg: {x: 64, y: 0, w: 64, h: 16},

    ltGSbDg: {x: 0, y: 16, w: 16, h: 32},
    ltGMbDg: {x: 16, y: 16, w: 16, h: 32},
    ltGLbDg: {x: 32, y: 16, w: 16, h: 32},
    ltGVlbDg: {x: 48, y: 16, w: 16, h: 32},

    rtGVlbDg: {x: 64, y: 16, w: 16, h: 32},
    rtGLbDg: {x: 80, y: 16, w: 16, h: 32},
    rtGMbDg: {x: 96, y: 16, w: 16, h: 32},
    rtGSbDg: {x: 112, y: 16, w: 16, h: 32},

    ltTpGSbDg: {x: 0, y: 48, w: 16, h: 16},
    ltTpGMbDg: {x: 16, y: 48, w: 16, h: 16},
    ltTpGLbDg: {x: 32, y: 48, w: 16, h: 16},
    ltTpGVlbDg: {x: 48, y: 48, w: 16, h: 16},

    rtTpGVlbDg: {x: 64, y: 48, w: 16, h: 16},
    rtTpGLbDg: {x: 80, y: 48, w: 16, h: 16},
    rtTpGMbDg: {x: 96, y: 48, w: 16, h: 16},
    rtTpGSbDg: {x: 112, y: 48, w: 16, h: 16},

    ltTpBtGSbDg: {x: 0, y: 64, w: 16, h: 32},
    ltTpBtGMbDg: {x: 16, y: 64, w: 16, h: 32},
    ltTpBtGLbDg: {x: 32, y: 64, w: 16, h: 32},
    ltTpBtGVlbDg: {x: 48, y: 64, w: 16, h: 32},

    rtTpBtGVlbDg: {x: 64, y: 64, w: 16, h: 32},
    rtTpBtGLbDg: {x: 80, y: 64, w: 16, h: 32},
    rtTpBtGMbDg: {x: 96, y: 64, w: 16, h: 32},
    rtTbBtGSbDg: {x: 112, y: 64, w: 16, h: 32},

    ltBtGSbDg: {x: 0, y: 96, w: 16, h: 16},
    ltBtGMbDg: {x: 16, y: 96, w: 16, h: 16},
    ltBtGLbDg: {x: 32, y: 96, w: 16, h: 16},
    ltBtGVlbDg: {x: 48, y: 96, w: 16, h: 16},

    rtBtGVlbDg: {x: 64, y: 96, w: 16, h: 16},
    rtBtGLbDg: {x: 80, y: 96, w: 16, h: 16},
    rtBtGMbDg: {x: 96, y: 96, w: 16, h: 16},
    rtBtGSbDg: {x: 112, y: 96, w: 16, h: 16},
}

function drawDungeonSprite(name, x, y) {
    const s = groundSprites[name];
    if (!s) {
        console.error("Unknown sprite:", name);
        return;
    }

    const el = document.createElement("div");
    el.classList.add("sprite");

    el.style.width = s.w + "px";
    el.style.height = s.h + "px";

    el.style.backgroundImage = "url('sprites/dungeonAssets/decorative_cracks_floor.png')";
    el.style.backgroundPosition = `-${s.x}px -${s.y}px`;

    el.style.left = x + "px";
    el.style.top = y + "px";

    document.getElementById("background").appendChild(el);
}


drawDungeonSprite("rtGSbDg", 64, 48);
drawDungeonSprite("ltGSbDg", 0, 0);
drawDungeonSprite("rtGSbDg", 64, 0);
drawDungeonSprite("tpGDg", 128, 112);
drawDungeonSprite("tpGDg", 100, 112);
drawDungeonSprite("ltGSbDg", 0, 100);
drawDungeonSprite("ltBtGSbDg", 0, 166);
drawDungeonSprite("btGDg", 128, 166);
drawDungeonSprite("btGDg", 64, 166);





    // Passable ground tiles

    // Impassable ground tiles

    // Trap ground tiles

    // Interactive ground tiles

// Wall tiles

    // Passable wall tiles

    // Impassable wall tiles

    // Trap wall tiles

    // Interactive wall tiles


// Full background