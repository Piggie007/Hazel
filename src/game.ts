import { Physics, Keys, Sprite } from './types';

class Game {
    private player: HTMLElement;
    private gameContainer: HTMLElement;
    private posX: number;
    private posY: number;
    private velocityX: number;
    private velocityY: number;
    private isJumping: boolean;
    private worldOffsetX: number;
    private worldOffsetY: number;
    private physics: Physics;
    private keys: Keys;
    private sprite: Sprite;
    private isFacingLeft: boolean;
    private readonly PHYSICS_HEIGHT = 50; // Height used for physics calculations

    constructor() {
        const playerElement = document.getElementById('player');
        const containerElement = document.getElementById('game-container');

        if (!playerElement || !containerElement) {
            throw new Error('Required elements not found');
        }

        this.player = playerElement;
        this.gameContainer = containerElement;
        this.sprite = {
            width: 50,
            height: 50
        };
        
        this.posX = window.innerWidth / 2 - this.sprite.width / 2;
        this.posY = window.innerHeight - this.sprite.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isFacingLeft = false;
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

    private init(): void {
        // Set ground level using PHYSICS_HEIGHT
        this.physics.groundLevel = window.innerHeight - this.PHYSICS_HEIGHT;
        this.posY = this.physics.groundLevel;
        this.updatePlayerPosition();
    }

    private updatePlayerPosition(): void {
        const centerX = window.innerWidth / 2 - this.sprite.width / 2;
        
        // Adjust visual position to account for sprite size difference
        const visualOffset = this.sprite.height - this.PHYSICS_HEIGHT;
        this.player.style.left = `${centerX}px`;
        this.player.style.top = `${this.posY - visualOffset}px`;

        if (this.velocityX < 0 && !this.isFacingLeft) {
            this.isFacingLeft = true;
            this.player.classList.add('facing-left');
        } else if (this.velocityX > 0 && this.isFacingLeft) {
            this.isFacingLeft = false;
            this.player.classList.remove('facing-left');
        }

        this.worldOffsetX -= this.velocityX;
        this.gameContainer.style.backgroundPosition = `${this.worldOffsetX}px ${this.worldOffsetY}px`;
    }

    private gameLoop = (): void => {
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

        // Ground collision check
        if (this.physics.groundLevel !== null && this.posY >= this.physics.groundLevel) {
            this.posY = this.physics.groundLevel;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Ensure we don't go above the screen or below ground level
        this.posY = Math.max(0, Math.min(this.posY, this.physics.groundLevel || window.innerHeight - this.sprite.height));

        this.updatePlayerPosition();
        requestAnimationFrame(this.gameLoop);
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
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

        window.addEventListener('keyup', (e: KeyboardEvent) => {
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

    private startGameLoop(): void {
        requestAnimationFrame(this.gameLoop);
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 