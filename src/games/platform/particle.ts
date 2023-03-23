import { draw4BitRectangle } from '@/games/platform/graphics';
import { Platform } from '@/games/platform/platform';
import { Color } from '@/games/platform/graphics';

export default class Particle {
  x: number;
  y: number;
  color: Color;
  size: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  lifeSpan: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(
    x: number,
    y: number,
    color: Color,
    canvasWidth: number,
    canvasHeight: number,
    angle: number,
    gravity: number
  ) {
    const randomAngle = angle + (Math.random() * 0.5 - 0.25);

    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 2;
    this.speed = Math.random() * 3;
    this.velocityX = Math.cos(randomAngle) * this.speed;
    this.velocityY = Math.sin(randomAngle) * this.speed;
    this.gravity = gravity;
    this.lifeSpan = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  update(platforms: Platform[]): void {
    // Apply gravity
    this.velocityY += this.gravity;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Check for platform collisions
    platforms.forEach((platform) => {
      if (
        this.x + this.size > platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.size > platform.y &&
        this.y < platform.y + platform.height
      ) {
        // Reverse Y velocity on collision
        this.velocityY *= -0.5;
        this.y = platform.y - this.size;
      }
    });

    // Keep particles within the canvas boundaries
    if (this.x < 0 || this.x + this.size > this.canvasWidth) {
      this.velocityX *= -1;
    }
    if (this.y < 0 || this.y + this.size > this.canvasHeight) {
      this.velocityY *= -0.5;
      this.y = this.y < 0 ? 0 : this.canvasHeight - this.size;
    }

    this.lifeSpan++;
  }

  render(ctx: CanvasRenderingContext2D): void {
    draw4BitRectangle(ctx, this.x, this.y, this.size, this.size, this.color);
  }
}
