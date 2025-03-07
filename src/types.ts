export interface Physics {
    speed: number;
    maxSpeed: number;
    friction: number;
    gravity: number;
    jumpForce: number;
    groundLevel: number | null;
}

export interface Keys {
    left: boolean;
    right: boolean;
}

export interface Sprite {
    width: number;
    height: number;
} 