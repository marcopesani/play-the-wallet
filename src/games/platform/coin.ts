import Particle from "@/games/platform/particle";
import { draw4BitRectangle } from "@/games/platform/graphics";

export default class Coin {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, unitX: number, unitY: number) {
    this.x = x;
    this.y = y;
    this.width = unitX;
    this.height = unitY;
  }

  createParticles(
    particleCount: number,
    canvasWidth: number,
    canvasHeight: number,
    playerX: number,
    playerY: number,
    gravity: number
  ): Particle[] {
    const particles: Particle[] = [];
    const angle = Math.atan2(
      this.y + this.height / 2 - playerY,
      this.x + this.width / 2 - playerX
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(
        new Particle(
          this.x + this.width / 2,
          this.y + this.height / 2,
          "yellow",
          canvasWidth,
          canvasHeight,
          angle,
          gravity
        )
      );
    }
    return particles;
  }

  render(ctx: CanvasRenderingContext2D): void {
    draw4BitRectangle(ctx, this.x, this.y, this.width, this.height, "yellow");
  }
}
