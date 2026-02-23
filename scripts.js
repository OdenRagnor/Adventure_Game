// --- Global Variables ---
let playerHealth = 10;
let maxHealth = 100;

let playerXP = 0;
let playerLvlMaxXP = 100;

let playerLevel = 1;

let gamePaused = false;

const playerLvl = document.getElementById("playerLvl");

let playerMana = 10;
let maxMana = 100;

// --- Element Selections ---
// Thanks to 'defer', we can safely do this at the top level.
const healthBarFill = document.getElementById("healthBarFill");

const xpBarFill = document.getElementById("xpBarFill");

const manaBarFill = document.getElementById("manaBarFill");

// It's still good practice to check if the element was found.
if (!healthBarFill) {
    console.error("Critical Error: Could not find element with ID 'healthBarFill'. Check your HTML for typos.");
}


// --- Functions ---


function goFullscreen() {
    const elem = document.documentElement; // whole page
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

document.addEventListener("click", function initFullscreen() {
    goFullscreen();
    document.removeEventListener("click", initFullscreen);
});

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

function takeDamage(amount) {
    playerHealth -= amount;

    // Ensure health doesn't go below 0.
    if (playerHealth < 0) {
        playerHealth = 0;
    }

    console.log("Player health: ", playerHealth);
    updateHealthBar(); // Call the update function.
}


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


function updateManaBar() {
    // Make sure we don't try to update a missing element.
    if (!manaBarFill) return;
    const manaPercentage = (playerMana / maxMana) * 100;
    // Set the width of the inner fill div.
    manaBarFill.style.width = Math.max(0, manaPercentage) + '%';

}



function loseMana(amount) {
    playerMana -= amount;

    // Ensure health doesn't go below 0.
    if (playerMana < 0) {
        playerMana = 0;
    }

    console.log("Player mana: ", playerMana);
    updateManaBar(); // Call the update function.
}

setInterval(() => {
    if (!gamePaused) {
        if ((playerHealth < maxHealth) || (playerMana < maxMana)) {
            healthRegen(1);
            manaRegen(2);
        } 
    }
}, 2000);

function healthRegen(amount) {
    playerHealth += amount;

    // Ensure health doesn't go below 0.
    if (playerHealth > maxHealth) {
        playerHealth = maxHealth;
    }

    console.log("Player health: ", playerHealth);
    updateHealthBar(); // Call the update function.
}

function manaRegen(amount) {
    playerMana += amount;

    if (playerMana > maxMana) {
        playerMana = maxMana;
    }
    updateManaBar(); 
}

updateManaBar();
updateHealthBar();
// Set the initial visual state of the health bar.

function death() {
    const msg = document.createElement("div");
    msg.textContent = "You have died!";
    msg.style.position = "fixed";
    msg.style.top = "40%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.background = "black";
    msg.style.color = "white";
    msg.style.padding = "20px";
    msg.style.fontSize = "24px";
    msg.style.border = "2px solid white";
    msg.style.zIndex = "9999";
    msg.style.textAlign = "center";

    const btn = document.createElement("button");
    btn.textContent = "Restart";
    btn.style.marginTop = "20px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
        location.reload();
    };

    msg.appendChild(document.createElement("br"));
    msg.appendChild(btn);

    document.body.appendChild(msg);
}


// Example: Make the player take 10 damage every 2 seconds.
/*setInterval(() => {
    if (!gamePaused) {
        if (playerHealth > 0) {
            takeDamage(10);
        } else {
            death();
            gamePaused = true;
        }
    }


}, 2000)*/

function gainXP(amount) {
    playerXP += amount;

    while (playerXP >= playerLvlMaxXP) {
        playerXP -= playerLvlMaxXP;   // carry leftover XP
        playerLvlMaxXP = Math.floor(playerLvlMaxXP + (playerLvlMaxXP * 0.05));
        playerLevel ++;
        playerLvl.textContent = playerLevel;
        updateLevelBoxWidth();
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
/*setInterval(() => {
        gainXP(10);
}, 1); */

updateXPBar();

function updateLevelBoxWidth() {
    const digits = playerLevel.toString().length;
    const baseWidth = 35;   // your original width
    const extra = (digits - 1) * 10;
    playerLvl.style.width = (baseWidth + extra) + "px";
}

// Player sprite system

let dx = 0;
let dy = 0;
let playerState = "idle";
let direction = "down"; // default facing direction
let frame = 0;
let lastFrameTime = 0;

const animations = {
    idle: {
        src: "sprites/swordsMan/Swordsman_lvl3_Idle_without_shadow.png",
        frameWidth: 64,
        frameHeight: 64,
        frameCounts: { down: 12, left: 12, right: 12, up: 4 },
        speed: { down: 100, left: 100, right: 100, up: 400 }
    },
    walk: {
        src: "sprites/swordsMan/Swordsman_lvl3_Walk_without_shadow.png",
        frameWidth: 64,
        frameHeight: 64,
        frameCounts: { down: 6, left: 6, right: 6, up: 6 },
        speed: { down: 100, left: 100, right: 100, up: 100 }
    },
    run: {
        src: "sprites/swordsMan/Swordsman_lvl3_Run_without_shadow.png",
        frameWidth: 64,
        frameHeight: 64,
        frameCounts: { down: 8, left: 8, right: 8, up: 8 },
        speed: { down: 70, left: 70, right: 70, up: 70 }
    },
    attack: {
        src: "sprites/swordsMan/Swordsman_lvl3_attack_without_shadow.png",
        frameWidth: 64,
        frameHeight: 64,
        frameCounts: { down: 6, left: 6, right: 6, up: 6 },
        speed: { down: 80, left: 80, right: 80, up: 80 }
    }
};

const playerElement = document.getElementById("player");

function setPlayerState(newState) {
    if (newState !== playerState) {
        playerState = newState;
        frame = 0;
        lastFrameTime = 0;

        const anim = animations[playerState];
        playerElement.style.backgroundImage = `url(${anim.src})`;
        playerElement.style.width = anim.frameWidth + "px";
        playerElement.style.height = anim.frameHeight + "px";
    }
}

function setDirection(dir) {
    if (direction !== dir) {
        direction = dir;
        frame = 0;
        lastFrameTime = 0;
    }
}

function setPlayerFrame(row, col, anim) {
    const x = col * anim.frameWidth;
    const y = row * anim.frameHeight;
    playerElement.style.backgroundPosition = `-${x}px -${y}px`;
}

function updateAnimation(timestamp) {
    const anim = animations[playerState];
    const frameCount = anim.frameCounts[direction];
    const speed = anim.speed[direction];

    if (timestamp - lastFrameTime >= speed) {
        frame = (frame + 1) % frameCount;
        lastFrameTime = timestamp;
    }

    const row = { down: 0, left: 1, right: 2, up: 3 }[direction];
    setPlayerFrame(row, frame, anim);
}

// Movement + camera

let playerX = 21372;
let playerY = 21316; // 21364 - 48
let playerSpeed = 4;
const runMultiplier = 1.1;

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.code] = true;
});

document.addEventListener("keyup", e => {
    keys[e.code] = false;
});

let cameraX = 0;
let cameraY = 0;

function gameLoop(timestamp) {
    
    if (gamePaused) return;

    dx = 0;
    dy = 0;
    // Movement input
    if (keys["KeyW"]) dy = -1;
    if (keys["KeyS"]) dy = 1;
    if (keys["KeyA"]) dx = -1;
    if (keys["KeyD"]) dx = 1;

    if (keys["ShiftLeft"] || keys["ShiftRight"]) {
        playerSpeed = playerSpeed * runMultiplier;
        if (playerSpeed > (4 * 1.5)) {
            playerSpeed = (4 * 1.5);
        } 
    }
    else {
            playerSpeed = 4;
    }

    // Direction
    if (dy < 0) setDirection("up");
    else if (dy > 0) setDirection("down");
    else if (dx < 0) setDirection("left");
    else if (dx > 0) setDirection("right");

    
    // State
    if (dx === 0 && dy === 0) {
        setPlayerState("idle");
    } else if (keys["ShiftLeft"] || keys["ShiftRight"]) {
        setPlayerState("run");
    } else {
        setPlayerState("walk");
    }

    // Normalize diagonal
    if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;

        let nextX = playerX + dx * playerSpeed;
        let nextY = playerY + dy * playerSpeed;

        if (isTileAt(nextX, nextY)) {
            playerX = nextX;
            playerY = nextY;
        }
    }

    // Camera follow
    cameraX = playerX - window.innerWidth / 2;
    cameraY = playerY - window.innerHeight / 2;

    background.style.left = -cameraX + "px";
    background.style.top = -cameraY + "px";

    updateAnimation(timestamp);
    goFullscreen();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
console.log("Player:", playerX, playerY, "dx:", dx, "dy:", dy, "tile:", isTileAt(playerX, playerY));



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

const wallSprites = {
    plainWall: {x: 0, y: 0, w: 64, h: 16, walkable: false},
    plainWall2: {x: 64, y: 0, w: 64, h: 32, walkable: false},
    wallCrackedTall: {x: 0, y: 224, w: 32, h: 48, walkable: false},
    wallBetweenfull: {x: 48, y: 16, w: 32, h: 80, walkable: false},
    tpHalfWallBetweenfull: {x: 48, y: 16, w: 32, h: 35, walkable: false}
}


function drawDungeonSprite(name, x, y) {
    const s = groundSprites[name] || wallSprites[name];

    if (!s) {
        console.error("Unknown sprite:", name);
        return;
    }

    const el = document.createElement("div");
    el.classList.add("sprite");

    el.style.width = s.w + "px";
    el.style.height = s.h + "px";

    const isWall = wallSprites[name] !== undefined;
    el.dataset.walkable = isWall ? "false" : "true";
    el.style.backgroundImage = isWall
        ? "url('sprites/dungeonAssets/decorative_cracks_walls.png')"
        : "url('sprites/dungeonAssets/decorative_cracks_floor.png')";

    el.style.backgroundPosition = `-${s.x}px -${s.y}px`;

    el.style.left = x + "px";
    el.style.top = y + "px";

    // store collision info
    el.dataset.x = x;
    el.dataset.y = y;
    el.dataset.w = s.w;
    el.dataset.h = s.h;

    document.getElementById("background").appendChild(el);
}

/*function drawDungeonSprite(name, x, y) {
    const s = groundSprites[name] || wallSprites[name];
    
    if (!s) {
        console.error("Unknown sprite:", name);
        return;
    }

    const el = document.createElement("div");
    el.classList.add("sprite");

    el.style.width = s.w + "px";
    el.style.height = s.h + "px";

    // Choose the correct PNG depending on which set it came from
    const isWall = wallSprites[name] !== undefined;
    el.style.backgroundImage = isWall
        ? "url('sprites/dungeonAssets/decorative_cracks_Walls.png')"
        : "url('sprites/dungeonAssets/decorative_cracks_floor.png')";

    el.style.backgroundPosition = `-${s.x}px -${s.y}px`;

    el.style.left = x + "px";
    el.style.top = y + "px";

    el.dataset.x = x;
    el.dataset.y = y;
    el.dataset.w = s.w;
    el.dataset.h = s.h;

    document.getElementById("background").appendChild(el);
}*/

function isTileAt(x, y) {
    const tiles = document.querySelectorAll("#background .sprite");

    const px = x;
    const py = y + 22;

    let foundWalkable = false;

    for (const tile of tiles) {
        const tx = parseInt(tile.dataset.x);
        const ty = parseInt(tile.dataset.y);

        const SCALE = 4;

        const tw = parseInt(tile.dataset.w) * SCALE;
        const th = parseInt(tile.dataset.h) * SCALE;

        const inside =
            px >= tx && px < tx + tw &&
            py >= ty && py < ty + th;

        if (inside) {
            const walkable = tile.dataset.walkable === "true";

            if (!walkable) {
                // ⭐ NON-WALKABLE TILE WINS
                return false;
            }

            foundWalkable = true;
        }
    }

    // If we found at least one walkable tile and no walls
    if (foundWalkable) return true;

    // Nothing under feet = not walkable
    return false;
}


//Break zoom for player
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '=')) {
        event.preventDefault();
    }
}, false);

// Prevent mouse wheel zoom
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });




// Start area

drawDungeonSprite("rtGSbDg", 21364, 21348);

drawDungeonSprite("ltGSbDg", 21300, 21300);
drawDungeonSprite("rtGSbDg", 21364, 21300);

drawDungeonSprite("wallCrackedTall", 21298, 21140)

// Top line
drawDungeonSprite("tpGDg", 21492, 21074);
drawDungeonSprite("btGDg", 21492, 21128);


drawDungeonSprite("tpGDg", 21684, 21074);
drawDungeonSprite("btGDg", 21684, 21128);

drawDungeonSprite("tpGDg", 21940, 21074);
drawDungeonSprite("btGDg", 21940, 21128);

// first left
drawDungeonSprite("tpGDg", 21428, 21412);
drawDungeonSprite("tpGDg", 21400, 21412);
drawDungeonSprite("ltGSbDg", 21300, 21400);
drawDungeonSprite("ltBtGSbDg", 21300, 21466);
drawDungeonSprite("btGDg", 21428, 21466);
drawDungeonSprite("btGDg", 21364, 21466);


drawDungeonSprite("tpGDg", 21684, 21412);
drawDungeonSprite("btGDg", 21684, 21466);

drawDungeonSprite("tpGDg", 21940, 21412);
drawDungeonSprite("btGDg", 21940, 21466);


// second left
drawDungeonSprite("ltGSbDg", 21492, 21300);
drawDungeonSprite("rtGSbDg", 21556, 21300);
drawDungeonSprite("ltGSbDg", 21492, 21304);
drawDungeonSprite("rtGSbDg", 21556, 21304);
drawDungeonSprite("ltGSbDg", 21492, 21172);
drawDungeonSprite("rtGSbDg", 21556, 21172);

drawDungeonSprite("wallBetweenfull", 21392, 21110);
drawDungeonSprite("tpHalfWallBetweenfull", 21392, 21030);
drawDungeonSprite("tpHalfWallBetweenfull", 21392, 20970);

drawDungeonSprite("wallBetweenfull", 21192, 21285);
drawDungeonSprite("tpHalfWallBetweenfull", 21192, 21205);
drawDungeonSprite("tpHalfWallBetweenfull", 21192, 21145);

// third left
drawDungeonSprite("ltGSbDg", 21940, 21300);
drawDungeonSprite("ltGSbDg", 21940, 21304);
drawDungeonSprite("ltGSbDg", 21940, 21172);

drawDungeonSprite("rtGSbDg", 22004, 21300);
drawDungeonSprite("rtGSbDg", 22004, 21304);
drawDungeonSprite("rtGSbDg", 22004, 21172);

drawDungeonSprite("rtGSbDg", 22040, 21300);
drawDungeonSprite("rtGSbDg", 22040, 21304);
drawDungeonSprite("rtGSbDg", 22040, 21172);

drawDungeonSprite("rtGSbDg", 22076, 21300);
drawDungeonSprite("rtGSbDg", 22076, 21304);
drawDungeonSprite("rtGSbDg", 22076, 21172);

drawDungeonSprite("rtGSbDg", 22102, 21300);
drawDungeonSprite("rtGSbDg", 22102, 21304);
drawDungeonSprite("rtGSbDg", 22102, 21172);

drawDungeonSprite("rtGSbDg", 22138, 21300);
drawDungeonSprite("rtGSbDg", 22138, 21304);
drawDungeonSprite("rtGSbDg", 22138, 21172);






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