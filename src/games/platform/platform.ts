import { getRandomInt } from "./utilities"; // Adjust the import path as needed
import { draw4BitRectangle } from "./graphics"; // Adjust the import path as needed

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class PlatformImpl implements Platform {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, unitX: number, unitY: number) {
    this.x = x;
    this.y = y;
    this.width = unitX * getRandomInt(2, 6);
    this.height = unitY;
  }

  render(ctx: CanvasRenderingContext2D): void {
    draw4BitRectangle(ctx, this.x, this.y, this.width, this.height, "green");
  }
}
