import { isKeyPressed } from "./utilities"; 
import { draw4BitRectangle } from "./graphics";
import { checkPlatformCollision } from "./physics"; 

interface KeysPressed {
  [key: string]: boolean;
}

export default class Player {
  x: number;
  y: number;
  unitX: number;
  unitY: number;
  canvasWidth: number;
  canvasHeight: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  jumpForce: number;
  onGround: boolean;
  acceleration: number;
  friction: number;
  canDoubleJump: boolean;
  doubleJumpForce: number;

  constructor(
    x: number,
    y: number,
    unit_x: number,
    unit_y: number,
    canvas_width: number,
    canvas_height: number,
    gravity: number
  ) {
    this.x = x;
    this.y = y;
    this.unitX = unit_x;
    this.unitY = unit_y;
    this.canvasWidth = canvas_width;
    this.canvasHeight = canvas_height;
    this.width = 20;
    this.height = 20;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = gravity;
    this.jumpForce = 5;
    this.onGround = false;
    this.acceleration = 0.1;
    this.friction = 0.4;
    this.canDoubleJump = false;
    this.doubleJumpForce = 5;
  }

  update(timestamp:number, platforms:any[], keysPressed:KeysPressed) {
    this.applyGravity();
    this.handleMovement(keysPressed);
    this.updatePosition();
    this.onGround = checkPlatformCollision(this, platforms);
    this.handleJump(keysPressed);
    this.checkCanvasBoundaries();
  }

  applyGravity() {
    this.velocityY += this.gravity;
  }

  handleMovement(keysPressed:KeysPressed) {
    const airFriction = this.onGround ? 1 : 1 / 3;

    if (keysPressed["ArrowLeft"]) {
      this.velocityX -= this.acceleration * airFriction;
    } else if (keysPressed["ArrowRight"]) {
      this.velocityX += this.acceleration * airFriction;
    } else {
      this.velocityX *= this.friction;
    }

    this.velocityX = Math.max(Math.min(this.velocityX, 5), -5);
  }

  updatePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  handleJump(keysPressed:KeysPressed) {
    if (this.onGround) {
      this.canDoubleJump = true;
      if (keysPressed["Space"]) {
        this.velocityY = -this.jumpForce;
        keysPressed["Space"] = false;
      }
    } else if (this.canDoubleJump && keysPressed["Space"]) {
      this.velocityY = -this.doubleJumpForce;
      this.canDoubleJump = false;
      keysPressed["Space"] = false;
    }
  }

  checkCanvasBoundaries() {
    const COR = 0.65;
    if (this.x < 0) {
      this.x = 0;
      this.velocityX = -this.velocityX * COR;
    }
    if (this.x + this.width > this.canvasWidth) {
      this.x = this.canvasWidth - this.width;
      this.velocityX = -this.velocityX * COR;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }
    if (this.y + this.height > this.canvasHeight) {
      this.y = this.canvasHeight - this.height;
      this.onGround = true;
    }
  }

  render(ctx:CanvasRenderingContext2D) {
    draw4BitRectangle(ctx, this.x, this.y, this.width, this.height, "white");
  }

  collidesWith(object:any) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }

  isJumpKeyPressed() {
    return isKeyPressed("Space");
  }
}
