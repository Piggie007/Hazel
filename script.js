const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
let posX = window.innerWidth / 2 - 25;
let posY = window.innerHeight / 2;
let velocityX = 0;
let velocityY = 0;
let isJumping = false;

// Camera/World position
let worldOffsetX = 0;
let worldOffsetY = 0;

const physics = {
    speed: 0.8,         // Increased acceleration
    maxSpeed: 8,        // Maximum horizontal speed
    friction: 0.9,      // Adjusted friction
    gravity: 0.5,       // Reduced gravity for better jump feel
    jumpForce: -15,     // Increased jump force
    groundLevel: null   // Will be set on init
};

// Initialize ground level
function init() {
    physics.groundLevel = window.innerHeight - 50; // Adjusted for player height
    posY = physics.groundLevel;
    updatePlayerPosition();
}

// Update player position
function updatePlayerPosition() {
    // Keep player centered and move the background instead
    const centerX = window.innerWidth / 2 - 25;
    const centerY = Math.min(posY, window.innerHeight / 2 - 25);
    
    player.style.left = `${centerX}px`;
    player.style.top = `${posY}px`;

    // Update background position based on player movement
    worldOffsetX -= velocityX;
    gameContainer.style.backgroundPosition = `${worldOffsetX}px ${worldOffsetY}px`;
}

// Game loop
function gameLoop() {
    // Update movement first
    if (keys.left) {
        velocityX = Math.max(velocityX - physics.speed, -physics.maxSpeed);
    }
    if (keys.right) {
        velocityX = Math.min(velocityX + physics.speed, physics.maxSpeed);
    }

    // Apply horizontal movement with friction
    posX += velocityX;
    if (!keys.left && !keys.right) {
        velocityX *= physics.friction;
    }

    // Apply gravity and vertical movement
    velocityY += physics.gravity;
    posY += velocityY;

    // Check for ground collision
    if (posY >= physics.groundLevel) {
        posY = physics.groundLevel;
        velocityY = 0;
        isJumping = false;
    }

    // Keep player within vertical bounds only
    posY = Math.max(0, Math.min(physics.groundLevel, posY));

    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

// Handle keyboard controls
const keys = {
    left: false,
    right: false
};

// Prevent space bar from scrolling
window.addEventListener('keydown', function(e) {
    if(e.code === 'Space') {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case ' ':
            if (!isJumping) {
                velocityY = physics.jumpForce;
                isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
    }
});

// Start the game
init();
requestAnimationFrame(gameLoop); 