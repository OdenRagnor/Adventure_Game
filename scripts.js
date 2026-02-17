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