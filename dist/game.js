class Game {
    constructor() {
        this.gameLoop = () => {
            if (this.keys.left) {
                this.velocityX = Math.max(this.velocityX - this.physics.speed, -this.physics.maxSpeed);
            }
            if (this.keys.right) {
                this.velocityX = Math.min(this.velocityX + this.physics.speed, this.physics.maxSpeed);
            }
            this.posX += this.velocityX;
            if (!this.keys.left && !this.keys.right) {
                this.velocityX *= this.physics.friction;
            }
            this.velocityY += this.physics.gravity;
            this.posY += this.velocityY;
            if (this.physics.groundLevel !== null && this.posY >= this.physics.groundLevel) {
                this.posY = this.physics.groundLevel;
                this.velocityY = 0;
                this.isJumping = false;
            }
            this.posY = Math.max(0, Math.min(this.posY, this.physics.groundLevel || window.innerHeight));
            this.updatePlayerPosition();
            requestAnimationFrame(this.gameLoop);
        };
        const playerElement = document.getElementById('player');
        const containerElement = document.getElementById('game-container');
        if (!playerElement || !containerElement) {
            throw new Error('Required elements not found');
        }
        this.player = playerElement;
        this.gameContainer = containerElement;
        this.posX = window.innerWidth / 2 - 25;
        this.posY = window.innerHeight / 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.worldOffsetX = 0;
        this.worldOffsetY = 0;
        this.physics = {
            speed: 0.8,
            maxSpeed: 8,
            friction: 0.9,
            gravity: 0.5,
            jumpForce: -15,
            groundLevel: null
        };
        this.keys = {
            left: false,
            right: false
        };
        this.init();
        this.setupEventListeners();
        this.startGameLoop();
    }
    init() {
        this.physics.groundLevel = window.innerHeight - 50;
        this.posY = this.physics.groundLevel;
        this.updatePlayerPosition();
    }
    updatePlayerPosition() {
        const centerX = window.innerWidth / 2 - 25;
        this.player.style.left = `${centerX}px`;
        this.player.style.top = `${this.posY}px`;
        this.worldOffsetX -= this.velocityX;
        this.gameContainer.style.backgroundPosition = `${this.worldOffsetX}px ${this.worldOffsetY}px`;
    }
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.isJumping && this.physics.groundLevel !== null) {
                    this.velocityY = this.physics.jumpForce;
                    this.isJumping = true;
                }
            }
            switch (e.key) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
            }
        });
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
            }
        });
    }
    startGameLoop() {
        requestAnimationFrame(this.gameLoop);
    }
}
// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
export {};
