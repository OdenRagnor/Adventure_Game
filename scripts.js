// --- Global Variables ---
let playerHealth = 100;
let maxHealth = 100;

const MONSTER_INTERACT_RADIUS = 120; // or 150

let monsterFrameCounter = 0;
let cachedTiles = [];

const TRASH_X = -999999;
const TRASH_Y = -999999;

let playerStamina = 100;
let maxStamina = 100;
let monsters = [];

let playerXP = 0;
let playerLvlMaxXP = 100;

let playerLevel = 1;

let gamePaused = false;

const playerLvl = document.getElementById("playerLvl");

let playerMana = 10;
let maxMana = 100;

const background = document.getElementById("background");

// --- Element Selections ---
// Thanks to 'defer', we can safely do this at the top level.
const healthBarFill = document.getElementById("healthBarFill");

const xpBarFill = document.getElementById("xpBarFill");

const manaBarFill = document.getElementById("manaBarFill");

const staminaBarFill = document.getElementById("staminaBarFill");

const staminaBar = document.getElementById("staminaBar");

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
        death();
        gamePaused = true;
    }

    updateHealthBar(); // Call the update function.
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

    updateManaBar(); // Call the update function.
}

setInterval(() => {
    if (!gamePaused) {
        if ((playerHealth < maxHealth) || (playerMana < maxMana) || (playerStamina < maxStamina)) {
            healthRegen(1);
            manaRegen(2);
            staminaRegen(4);
        } 
    }
}, 2000);

function healthRegen(amount) {
    playerHealth += amount;

    // Ensure health doesn't go below 0.
    if (playerHealth > maxHealth) {
        playerHealth = maxHealth;
    }

    updateHealthBar(); // Call the update function.
}

function manaRegen(amount) {
    playerMana += amount;

    if (playerMana > maxMana) {
        playerMana = maxMana;
    }
    updateManaBar(); 
}


function updateStaminaBar() {
    // Make sure we don't try to update a missing element.
    if (!staminaBarFill) return;
    const staminaPercentage = (playerStamina / maxStamina) * 100;
    // Set the width of the inner fill div.
    staminaBarFill.style.width = Math.max(0, staminaPercentage) + '%';
}

function lowerStamina(amount) {
    playerStamina -= amount;

    // Ensure stamina doesn't go below 0.
    if (playerStamina < 0) {
        playerStamina = 0;
    }

    updateStaminaBar(); // Call the update function.
}

function staminaRegen(amount) {
    playerStamina += amount;

    if (playerStamina > maxStamina) {
        playerStamina = maxStamina;
    }
    updateStaminaBar(); 
}

setInterval(() => {
    if (!gamePaused) {
        if ((keys["ShiftLeft"] || keys["ShiftRight"]) &&
            (keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"])) {

            lowerStamina(5);
        } 
        
        if (isAttacking === true) {
            lowerStamina(7);
        }
    }

    updateStaminaBar();
}, 500);

updateStaminaBar();
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

function gainXP(amount) {
    playerXP += amount;

    while (playerXP >= playerLvlMaxXP) {
        playerXP -= playerLvlMaxXP;   // carry leftover XP
        playerLvlMaxXP = Math.floor(playerLvlMaxXP + (playerLvlMaxXP * 0.05));
        playerLevel ++;
        playerLvl.textContent = playerLevel;
        updateLevelBoxWidth();
    }

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

/*
setInterval(() => {
        gainXP(0);
}, 1); 
*/

function updateLevelBoxWidth() {
    const digits = playerLevel.toString().length;
    const baseWidth = 35;   // your original width
    const staminaBaseWidth = 184;
    const extra = (digits - 1) * 10;
    playerLvl.style.width = (baseWidth + extra) + "px";
    staminaBar.style.width = (staminaBaseWidth + extra) + "px";
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

//Attack hitbox
function getAttackHitbox() {
    const size = 32; //attack range
    const px = playerX;
    const py = playerY;

    if (direction === "up") {
        return { x: px - 20, y: py - size, w : 40, h: size };
    }
    if (direction === "down") {
        return { x: px - 20, y: py + 40, w: 40, h: size };
    }
    if (direction === "left") {
        return { x: px - size, y: py - 20, w: size, h: 40 };
    }
    if (direction === "right") {
        return { x: px + 40, y: py - 20, w: size, h: 40 };
    }
}

//Rectangle overlap helper

function rectOverlap(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

//Attack animation

let isAttacking = false;

function startAttack() {
    if (isAttacking) return; // prevents spamming
    if (playerStamina === 0) return;
    
    isAttacking = true;
    setPlayerState("attack");
    
    const hitbox = getAttackHitbox();

    const ATTACK_RADIUS = 100;

    for (const mon of monsters) {
        const dx = mon.x - playerX;
        const dy = mon.y - playerY;

        if (dx*dx + dy*dy > ATTACK_RADIUS * ATTACK_RADIUS) {
            continue;
        }

        if (rectOverlap(hitbox, { x: mon.x, y: mon.y, w: 64, h: 64 })) {
            mon.takeDamage(10);
        }
    }
    
    /*monsters.forEach(mon => {
        if (rectOverlap(hitbox, { x: mon.x, y: mon.y, w: 64, h: 64})) {
            mon.takeDamage(10);
        }
    });*/

    // Attack animation lasts 6 frames × 80ms = 480ms
    setTimeout(() => {
        isAttacking = false;
        setPlayerState("idle");
    }, 480);
}

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

let playerX = 21370;
let playerY = 21320; // 21364 - 48
let playerSpeed = 4;

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.code] = true;
});

document.addEventListener("keyup", e => {
    keys[e.code] = false;
});

let cameraX = 0;
let cameraY = 0;


function playerCanMoveTo(x, y) {
        const ox = x + 8;  // shift hitbox right
        const oy = y + 8;  // shift hitbox down
        const w = 16;
        const h = 16;

        return (
            isTileAt(ox, oy) &&
            isTileAt(ox + w, oy) &&
            isTileAt(ox, oy + h) &&
            isTileAt(ox + w, oy + h)
        );

    }

    function monsterCanMoveTo(x, y) {
        const centerX = x;
        const centerY = y;

        const ox = centerX + 40; // shift hitbox right
        const oy = centerY + 40; // shift hitbox down
        const w = 16;
        const h = 16;

        return (
            isTileAt(ox, oy) &&
            isTileAt(ox + w, oy) &&
            isTileAt(ox, oy + h) &&
            isTileAt(ox + w, oy + h)
        );
    }

function gameLoop(timestamp) {
    
    if (gamePaused) return;

    
    if (keys["Space"]){
        startAttack();
    }

    if (isAttacking) {
        dx = 0;
        dy = 0;
    }

    dx = 0;
    dy = 0;
    // Movement input
    if (keys["KeyW"]) dy = -1;
    if (keys["KeyS"]) dy = 1;
    if (keys["KeyA"]) dx = -1;
    if (keys["KeyD"]) dx = 1;

    if ((keys["ShiftLeft"] || keys["ShiftRight"]) && (keys["KeyW"] || keys["KeyS"] || keys["KeyA"] || keys["KeyD"])) {
        playerSpeed = 6;
        if (playerStamina === 0) {
            playerSpeed = 4;
        }
    } else {playerSpeed = 4}
    

    // Direction
    if (dy < 0) setDirection("up");
    else if (dy > 0) setDirection("down");
    else if (dx < 0) setDirection("left");
    else if (dx > 0) setDirection("right");

    
    // State
    if (isAttacking) {
        setPlayerState("attack");
    } else if (dx === 0 && dy === 0) {
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

        // X movement
        if (!playerWouldHitMonster(nextX, playerY) && playerCanMoveTo(nextX, playerY)) {
            playerX = nextX;
        }

        // Y movement
        if (!playerWouldHitMonster(playerX, nextY) && playerCanMoveTo(playerX, nextY)) {
            playerY = nextY;
        }
    }

    const PLAYER_RADIUS = 300; // or even 400 to be super safe

    for (const m of monsters) {
        // ensure cooldown exists
        if (!m.lastAttackTime) m.lastAttackTime = 0;

        const dx = m.x - playerX;
        const dy = m.y - playerY;

        // broad-phase: skip far monsters
        if (dx*dx + dy*dy > PLAYER_RADIUS * PLAYER_RADIUS) {
            continue;
        }

        if (rectOverlap(
            { x: playerX, y: playerY, w: 40, h: 40 },
            { x: m.x, y: m.y, w: 40, h: 40 }
        )) {
            const now = Date.now();
            if (now - m.lastAttackTime >= 1500) {
                takeDamage(10);
                m.lastAttackTime = now;
            }
        }
    }
    /*//Monster damage player
    for (const m of monsters) {
        // Give each monster its own cooldown timer
        if (!m.lastAttackTime) m.lastAttackTime = 0;

        if (rectOverlap(
            { x: playerX, y: playerY, w: 40, h: 40 },
            { x: m.x, y: m.y, w: 40, h: 40 }
        )) {
            const now = Date.now();

            // Monster can only attack every 2 seconds
            if (now - m.lastAttackTime >= 1500) {
                takeDamage(10);
                m.lastAttackTime = now;
            }
        }
    }*/

    const screenLeft = cameraX - 200;
    const screenRight = cameraX + window.innerWidth + 200;
    const screenTop = cameraY - 200;
    const screenBottom = cameraY + window.innerHeight + 200;

    monsters.forEach(m => {
        const speed = 3.9;

        // Distance to player
        const dist = Math.hypot(playerX - m.x, playerY - m.y);

        // Ignore player unless within 200px
        if (dist > 400) {
            return;
        }

        if (dist > 800) {
            // Skip ALL logic: no animation, no movement, no DOM writes
            return;
        }

        if (m.x < screenLeft || m.x > screenRight ||
        m.y < screenTop || m.y > screenBottom) {
        return; // skip everything
    }
        // --- CHASE LOGIC (only runs if close enough) ---
        const dx = playerX - m.x;
        const dy = playerY - m.y;

        // Direction
        if (Math.abs(dx) > Math.abs(dy)) {
            m.direction = dx > 0 ? "right" : "left";
        } else {
            m.direction = dy > 0 ? "down" : "up";
        }

        // State
        if (dist <= 400) {
            m.state = "walk";
        } else if (dist > 400) {
            m.state = "idle";
        } else { 
            m.state = "idle";
        }

        const len = Math.hypot(dx, dy);

        const stepX = (dx / len) * speed;
        const stepY = (dy / len) * speed;

        const nextX = m.x + stepX;
        const nextY = m.y + stepY;

        // X movement
        if (monsterCanMoveTo(nextX, m.y) &&
            !monsterWouldHitPlayer(nextX, m.y) &&
            !monsterWouldHitMonster(m, nextX, m.y)) {

            m.x = nextX;
        }

        // Y movement
        if (monsterCanMoveTo(m.x, nextY) &&
            !monsterWouldHitPlayer(m.x, nextY) &&
            !monsterWouldHitMonster(m, m.x, nextY)) {

            m.y = nextY;
        }

        m.updatePosition();
        updateMonsterAnimation(m, timestamp);
    }); 


    // Camera follow
    cameraX = playerX - window.innerWidth / 2;
    cameraY = playerY - window.innerHeight / 2;

    background.style.left = -cameraX + "px";
    background.style.top = -cameraY + "px";


    updateAnimation(timestamp);
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

goFullscreen();

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
    wallCrackedTall: {x: 0, y: 226, w: 32, h: 42, walkable: false},
    wallBetweenfull: {x: 48, y: 16, w: 32, h: 80, walkable: false},
    tpHalfWallBetweenfull: {x: 48, y: 16, w: 32, h: 35, walkable: false},
    btHalfwallBetweenfull: {x: 48, y: 41, w: 32, h: 55, walkable: false},
    tpRtHalfWallBetweenfull: {x: 58, y: 16, w: 22, h: 35, walkable: false},
    btRtHalfwallBetweenfull: {x: 58, y: 41, w: 22, h: 55, walkable: false},
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

    background.appendChild(el);
    cachedTiles.push(el);
    document.getElementById("background").appendChild(el);
}


// Music
const townTracks = [
  new Audio("Music/woodland/woodland1.mp3"),
  new Audio("Music/woodland/woodland2.mp3"),
  new Audio("Music/woodland/woodland3.mp3"),
  new Audio("Music/woodland/woodland4.mp3"),
  new Audio("Music/woodland/woodland5.mp3"),
  new Audio("Music/woodland/woodland6.mp3"),
  new Audio("Music/woodland/woodland7.mp3"),
  new Audio("Music/woodland/woodland8.mp3"),
  new Audio("Music/woodland/woodland9.mp3")
];

// Shared properties
townTracks.forEach(track => {
  track.loop = false;     // IMPORTANT: disable looping
  track.volume = 0.5;
});

let currentTownTrack = null;

// Pick a random track that isn't the same as the last one
function playRandomTownTrack() {
  // stop all
  townTracks.forEach(t => {
    t.pause();
    t.currentTime = 0;
  });

  let nextTrack;
  do {
    nextTrack = townTracks[Math.floor(Math.random() * townTracks.length)];
  } while (nextTrack === currentTownTrack);

  currentTownTrack = nextTrack;
  currentTownTrack.play();

  // When it ends, pick another
  currentTownTrack.onended = () => {
    if (musicEnabled) {
      playRandomTownTrack();
    }
  };

  return currentTownTrack;
}

// First user click starts music
document.addEventListener("click", () => {
  currentTownTrack = playRandomTownTrack();
}, { once: true });

// MUSIC TOGGLE BUTTON
let musicEnabled = true;

document.getElementById("toggleMusic").addEventListener("click", () => {
  if (musicEnabled) {
    townTracks.forEach(t => {
      t.pause();
      t.currentTime = 0;
    });
    musicEnabled = false;
  } else {
    musicEnabled = true;
    currentTownTrack = playRandomTownTrack();
  }
});


function getPlayerHitbox() {
    return {
        x: playerX + 8,
        y: playerY + 8,
        w: 16,
        h: 16
    };
}


function monsterWouldHitMonster(mon, nextX, nextY) {
    const boxNext = {
        x: nextX + 32,
        y: nextY + 32,
        w: 16,
        h: 16
    };

    for (const other of monsters) {
        if (other === mon || other.dead) continue;

        // Broad-phase: skip if too far
        const dx = other.x - nextX;
        const dy = other.y - nextY;
        if (dx*dx + dy*dy > MONSTER_INTERACT_RADIUS * MONSTER_INTERACT_RADIUS) {
            continue;
        }

        // Narrow-phase: actual hitbox overlap
        const otherBox = {
            x: other.x + 32,
            y: other.y + 32,
            w: 16,
            h: 16
        };

        if (rectOverlap(boxNext, otherBox)) {
            return true;
        }
    }

    return false;
}
/*function monsterWouldHitMonster(mon, nextX, nextY) {
    const boxNext = {
        x: nextX + 32,
        y: nextY + 32,
        w: 16,
        h: 16
    };

    for (const other of monsters) {
        if (other === mon || other.dead) continue;

        const otherBox = {
            x: other.x + 32,
            y: other.y + 32,
            w: 16,
            h: 16
        };

        if (rectOverlap(boxNext, otherBox)) {
            return true;
        }
    }

    return false;
}*/

function playerWouldHitMonster(nextX, nextY) {
    const pNext = {
        x: nextX - 18,
        y: nextY - 8,
        w: 16,
        h: 16
    };

    const pCur = {
        x: playerX - 18,
        y: playerY - 8,
        w: 16,
        h: 16
    };

    // helper to get center
    function center(box) {
        return {
            x: box.x + box.w / 2,
            y: box.y + box.h / 2
        };
    }

    const pCurC = center(pCur);
    const pNextC = center(pNext);

    for (const m of monsters) {
        const mBox = {
            x: m.x + 8,
            y: m.y + 8,
            w: 16,
            h: 16
        };
        const mC = center(mBox);

        const distCur = Math.hypot(pCurC.x - mC.x, pCurC.y - mC.y);
        const distNext = Math.hypot(pNextC.x - mC.x, pNextC.y - mC.y);

        // Only block if:
        // 1) next position overlaps AND
        // 2) you're moving CLOSER to the monster
        if (rectOverlap(pNext, mBox) && distNext < distCur) {
            return true;
        }
    }

    return false;
}

function monsterWouldHitPlayer(nextX, nextY) {
    const playerBox = getPlayerHitbox();

    const monsterBox = {
        x: nextX + 32,  // same offset you used for monster hitbox
        y: nextY + 32,
        w: 16,
        h: 16
    };

    return rectOverlap(monsterBox, playerBox);
}

function isTileAt(x, y) {
    const px = x - 18;
    const py = y - 2;

    let foundWalkable = false;

    for (const tile of cachedTiles) {
        const tx = parseInt(tile.dataset.x);
        const ty = parseInt(tile.dataset.y);

        const SCALE = 4;
        const tw = parseInt(tile.dataset.w) * SCALE;
        const th = parseInt(tile.dataset.h) * SCALE;

        const inside =
            px >= tx && px < tx + tw &&
            py >= ty && py < ty + th;

        if (inside) {
            if (tile.dataset.walkable === "false") return false;
            foundWalkable = true;
        }
    }

    return foundWalkable;
}

/*
function isTileAt(x, y) {
    const tiles = document.querySelectorAll("#background .sprite");

    const px = x - 18;
    const py = y - 2;

    let foundWalkable = false;

    if (!foundWalkable) 

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
*/

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

drawDungeonSprite("wallCrackedTall", 21298, 21140);

// Top line
drawDungeonSprite("tpGDg", 21492, 21074);
drawDungeonSprite("btGDg", 21492, 21128);


drawDungeonSprite("tpGDg", 21684, 21074);
drawDungeonSprite("btGDg", 21684, 21128);

drawDungeonSprite("tpGDg", 21940, 21074);
drawDungeonSprite("btGDg", 21940, 21128);

drawDungeonSprite("tpGDg", 22196, 21074);
drawDungeonSprite("btGDg", 22196, 21128);

drawDungeonSprite("btGDg", 22196, 21172);
drawDungeonSprite("btGDg", 22196, 21216);
drawDungeonSprite("btGDg", 22196, 21260);
drawDungeonSprite("btGDg", 22196, 21304);
drawDungeonSprite("btGDg", 22196, 21348);
drawDungeonSprite("btGDg", 22196, 21392);

drawDungeonSprite("tpGDg", 22396, 21074);
drawDungeonSprite("btGDg", 22396, 21128);
drawDungeonSprite("btGDg", 22396, 21172);
drawDungeonSprite("btGDg", 22396, 21216);
drawDungeonSprite("btGDg", 22396, 21260);
drawDungeonSprite("btGDg", 22396, 21304);
drawDungeonSprite("btGDg", 22396, 21348);
drawDungeonSprite("btGDg", 22396, 21392);

drawDungeonSprite("btGDg", 22196, 21436);
drawDungeonSprite("btGDg", 22396, 21436);
drawDungeonSprite("btGDg", 22196, 21480);
drawDungeonSprite("btGDg", 22396, 21480);
drawDungeonSprite("btGDg", 22196, 21524);
drawDungeonSprite("btGDg", 22396, 21524);
drawDungeonSprite("btGDg", 22196, 21568);
drawDungeonSprite("btGDg", 22396, 21568);
drawDungeonSprite("btGDg", 22196, 21602);
drawDungeonSprite("btGDg", 22396, 21602);
drawDungeonSprite("btGDg", 22196, 21646);
drawDungeonSprite("btGDg", 22396, 21646);
drawDungeonSprite("btGDg", 22196, 21690);
drawDungeonSprite("btGDg", 22396, 21690);
drawDungeonSprite("btGDg", 22196, 21734);
drawDungeonSprite("btGDg", 22396, 21734);

drawDungeonSprite("btGDg", 22196, 21778);
drawDungeonSprite("btGDg", 22396, 21778);
drawDungeonSprite("btGDg", 21796, 21778);
drawDungeonSprite("btGDg", 21996, 21778);
drawDungeonSprite("btGDg", 21396, 21778);
drawDungeonSprite("btGDg", 21596, 21778);
drawDungeonSprite("btGDg", 21196, 21778);

drawDungeonSprite("btGDg", 22196, 21812);
drawDungeonSprite("btGDg", 22396, 21812);
drawDungeonSprite("btGDg", 21796, 21812);
drawDungeonSprite("btGDg", 21996, 21812);
drawDungeonSprite("btGDg", 21396, 21812);
drawDungeonSprite("btGDg", 21596, 21812);
drawDungeonSprite("btGDg", 21196, 21812);

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
drawDungeonSprite("btRtHalfwallBetweenfull", 21488, 20870);
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
drawDungeonSprite("btHalfwallBetweenfull", 21192, 21433);
drawDungeonSprite("btHalfwallBetweenfull", 21192, 21481);
drawDungeonSprite("btHalfwallBetweenfull", 21192, 21529);
drawDungeonSprite("btHalfwallBetweenfull", 21192, 21569);
drawDungeonSprite("tpHalfWallBetweenfull", 21192, 21205);
drawDungeonSprite("tpHalfWallBetweenfull", 21192, 21145);
drawDungeonSprite("tpHalfWallBetweenfull", 21392, 20890);
drawDungeonSprite("tpHalfWallBetweenfull", 21392, 20850);
drawDungeonSprite("tpHalfWallBetweenfull", 21392, 20816);

// third left
drawDungeonSprite("ltGSbDg", 21640, 21300);
drawDungeonSprite("ltGSbDg", 21640, 21304);
drawDungeonSprite("ltGSbDg", 21640, 21172);

drawDungeonSprite("rtGSbDg", 21704, 21300);
drawDungeonSprite("rtGSbDg", 21704, 21304);
drawDungeonSprite("rtGSbDg", 21704, 21172);

drawDungeonSprite("rtGSbDg", 21740, 21300);
drawDungeonSprite("rtGSbDg", 21740, 21304);
drawDungeonSprite("rtGSbDg", 21740, 21172);

drawDungeonSprite("rtGSbDg", 21776, 21300);
drawDungeonSprite("rtGSbDg", 21776, 21304);
drawDungeonSprite("rtGSbDg", 21776, 21172);

drawDungeonSprite("rtGSbDg", 21802, 21300);
drawDungeonSprite("rtGSbDg", 21802, 21304);
drawDungeonSprite("rtGSbDg", 21802, 21172);

drawDungeonSprite("rtGSbDg", 21838, 21300);
drawDungeonSprite("rtGSbDg", 21838, 21304);
drawDungeonSprite("rtGSbDg", 21838, 21172);


// forth left
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


//first mid
drawDungeonSprite("wallCrackedTall", 21727, 21160);
drawDungeonSprite("wallCrackedTall", 21672, 21160);
drawDungeonSprite("tpHalfWallBetweenfull", 21592, 21160);
drawDungeonSprite("btHalfwallBetweenfull", 21592, 21215);

drawDungeonSprite("tpHalfWallBetweenfull", 21842, 21160);
drawDungeonSprite("btHalfwallBetweenfull", 21842, 21215);


// first bottom
drawDungeonSprite("tpRtHalfWallBetweenfull", 21288, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21288, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21318, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21318, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21348, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21348, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21378, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21378, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21408, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21408, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21438, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21438, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21468, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21468, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21498, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21498, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21528, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21528, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21558, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21558, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21588, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21588, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21618, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21618, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21648, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21648, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21678, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21678, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21708, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21708, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21738, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21738, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21768, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21768, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21798, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21798, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21828, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21828, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21858, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21858, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21888, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21888, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21918, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21918, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21948, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21948, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21978, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 21978, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22008, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22008, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22038, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22038, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22068, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22068, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22098, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22098, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22128, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22128, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22158, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22158, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22188, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22188, 21570);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22218, 21515);
drawDungeonSprite("btRtHalfwallBetweenfull", 22218, 21510);
drawDungeonSprite("btRtHalfwallBetweenfull", 22218, 21570);


//first far right wall
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21395);
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21345);
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21295);
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21245);
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21195);
drawDungeonSprite("tpHalfWallBetweenfull", 22178, 21170);


// first hallway after circle room
drawDungeonSprite("tpRtHalfWallBetweenfull", 21488, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21512, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21518, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21518, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21548, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21548, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21578, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21578, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21608, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21608, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21638, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21638, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21668, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21668, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21698, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21698, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21728, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21728, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21758, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21758, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21788, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21788, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21818, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21818, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21848, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21848, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21878, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21878, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21908, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21908, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21938, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21938, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21968, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21968, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 21998, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 21998, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22028, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22028, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22058, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22058, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22088, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22088, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22118, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22118, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22148, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22148, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22178, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22178, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22208, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22208, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22238, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22238, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22268, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22268, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22298, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22298, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22358, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22358, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22388, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22388, 20870);
drawDungeonSprite("tpRtHalfWallBetweenfull", 22418, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22418, 20870);

//Far right
drawDungeonSprite("wallBetweenfull", 22392, 21110);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21030);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 20970);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 20890);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 20850);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 20816);

drawDungeonSprite("tpRtHalfWallBetweenfull", 22328, 20815);
drawDungeonSprite("btRtHalfwallBetweenfull", 22328, 20870);



drawDungeonSprite("wallBetweenfull", 22392, 21810);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21730);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21670);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21590);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21550);
drawDungeonSprite("tpHalfWallBetweenfull", 22392, 21516);


// ===============================
// SAVE / LOAD SYSTEM FOR YOUR GAME
// ===============================

// Download a save file to the player's PC
function saveToPC(data) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "MyGameSave.json";
  a.click();

  URL.revokeObjectURL(url);
  console.log("Save file downloaded");
}

// Load a save file from the player's PC
function loadFromPC(callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);
        callback(data);
        console.log("Save file loaded");
      } catch (err) {
        console.error("Invalid save file");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// ===============================
// SAVE GAME (your variables)
// ===============================

function saveGame() {
  const data = {
    playerX,
    playerY,
    playerSpeed,
    dx,
    dy,
    playerState,
    direction,
    playerMana,
    maxMana,
    playerHealth,
    maxHealth,
    playerStamina,
    maxStamina,
    playerXP,
    playerLvlMaxXP,
    playerLevel,
    gamePaused
    
    };

  saveToPC(data);
}

// ===============================
// LOAD GAME (restore variables)
// ===============================

function loadGame() {

  // If fullscreen is active, exit it first
  const wasFullscreen = !!document.fullscreenElement;

  if (wasFullscreen) {
    document.exitFullscreen();
  }

  // Now open the file picker safely
  loadFromPC(data => {

    // Restore your variables
    playerX = data.playerX;
    playerY = data.playerY;
    playerSpeed = data.playerSpeed;
    dx = data.dx;
    dy = data.dy;
    playerState = data.playerState;
    direction = data.direction;
    playerMana = data.playerMana;
    maxMana = data.maxMana;
    playerHealth = data.playerHealth;
    maxHealth = data.maxHealth;
    playerStamina = data.playerStamina;
    maxStamina = data.maxStamina;
    playerXP = data.playerXP;
    playerLvlMaxXP = data.playerLvlMaxXP;
    playerLevel = data.playerLevel;
    gamePaused = data.gamePaused;

    console.log("Game state restored");

    // Re-enter fullscreen AFTER loading
    if (wasFullscreen) {
      document.documentElement.requestFullscreen();
    }
  });
}

// ===============================
// OPTIONAL: KEYBINDS
// ===============================

document.addEventListener("keydown", e => {
  if (e.key === "k") saveGame(); // Press K to save
  if (e.key === "l") loadGame(); // Press L to load
});

// ==========================
// Menu
// ==========================

window.addEventListener("DOMContentLoaded", () => {

  const gameMenu = document.getElementById("gameMenu");
  const closeMenuBtn = document.getElementById("closeMenu");

  function openMenu() {
    gameMenu.style.display = "block";
  }

  function closeMenu() {
    gameMenu.style.display = "none";
  }

  closeMenuBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", e => {
    if (e.key === "o") {
      if (gameMenu.style.display === "block") {
        closeMenu();
      } else {
        openMenu();
      }
    }
  });

  document.getElementById("saveBtn").addEventListener("click", saveGame);
  document.getElementById("loadBtn").addEventListener("click", loadGame);

});


//=============================================
//Making Monsters
//=============================================

class Deer {
    constructor(x, y, hp = 20) {
        this.x = x;
        this.y = y;
        this.hp = hp;

        this.element = document.createElement('div');
        this.element.classList.add("monster")
        this.element.style.width = "32px";
        this.element.style.height = "32px";
        this.element.style.backgroundImage = "url(sprites/huntAnimals/Deer_Idle.png)";
        this.element.style.backgroundRepeat = "no-repeat";
        this.element.style.imageRendering = "pixelated";
        this.element.style.position = "absolute";
        this.state = "idle";
        this.direction = "down";
        this.frame = 0;
        this.lastFrameTime = 0;
        document.getElementById("background").appendChild(this.element);

        this.state = "idle",
        this.direction = "down",
        this.frame = 0,
        this.lastFrameTime = 0,

        this.updatePosition();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) this.die();
    }
    
   die() {
        this.dead = true;
        gainXP(10);
        this.x = TRASH_X;
        this.y = TRASH_Y;
        this.updatePosition();
        if (this.element) {
            this.element.remove();
        }
    }


    updatePosition() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }

}

monsters.push(new Deer(playerX + 540, playerY + 120));
monsters.push(new Deer(21940, 21436));
monsters.push(new Deer(21980, 21436));
monsters.push(new Deer(21960, 21436));


const deerAnimations = {
    idle: {
        src: "sprites/deer/deer_idle.png",
        frameWidth: 32,
        frameHeight: 32,
        frameCounts: { down: 4, left: 4, right: 4, up: 4 },
        speed: { down: 200, left: 200, right: 200, up: 200 }
    },
    walk: {
        src: "sprites/huntAnimals/Deer_Run.png",
        frameWidth: 32,
        frameHeight: 32,
        frameCounts: { down: 6, left: 6, right: 6, up: 6 },
        speed: { down: 120, left: 120, right: 120, up: 120 }
    },
};

function updateMonsterAnimation(mon, timestamp) {
    const anim = deerAnimations[mon.state];
    const frameCount = anim.frameCounts[mon.direction];
    const speed = anim.speed[mon.direction];

    mon.element.style.backgroundImage = `url(${anim.src})`;
    mon.element.style.width = anim.frameWidth + "px";
    mon.element.style.height = anim.frameHeight + "px";

    if (timestamp - mon.lastFrameTime >= speed) {
        mon.frame = (mon.frame + 1) % frameCount;
        mon.lastFrameTime = timestamp;
    }

    const row = { down: 0, left: 2, right: 1, up: 3 }[mon.direction];
    const x = mon.frame * anim.frameWidth;
    const y = row * anim.frameHeight;

    mon.element.style.backgroundPosition = `-${x}px -${y}px`;
}

//UI Assets

// Create inventory window once
const inventoryWindow = document.createElement("div");
inventoryWindow.textContent = "Inventory";
inventoryWindow.style.position = "absolute";
inventoryWindow.style.bottom = "7%";
inventoryWindow.style.right = "5%";
inventoryWindow.style.background = "black";
inventoryWindow.style.color = "white";
inventoryWindow.style.padding = "20px";
inventoryWindow.style.fontSize = "24px";
inventoryWindow.style.border = "2px solid white";
inventoryWindow.style.zIndex = "9999999999";
inventoryWindow.style.textAlign = "center";
inventoryWindow.style.display = "none";
document.body.appendChild(inventoryWindow);

// Toggle function
function invBtn() {
    inventoryWindow.style.display =
        inventoryWindow.style.display === "none" ? "block" : "none";
}

// Button
const inventory = document.createElement("button");
inventory.classList.add("InvBtn");
inventory.style.width = "36px";
inventory.style.height = "36px";
inventory.style.cursor = "pointer";
inventory.style.position = "absolute";
inventory.style.bottom = "10px";
inventory.style.right = "10px";
inventory.style.zIndex = "9999999999";
inventory.style.background = "url(sprites/UI/Inventory.png)";
inventory.style.backgroundColor = "whitesmoke";
inventory.style.borderRadius = "5px";
inventory.style.transform = "scale(1.25)";
inventory.addEventListener("click", invBtn);

document.body.appendChild(inventory);