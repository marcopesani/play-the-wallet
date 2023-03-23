import Player from "./player";
import Platform from "./platform";
import Coin from "./coin";
import Particle from "./particle";
import { getRandomInt, generateRandomSeed } from "./utilities"; // Adjust the import path as needed
import * as BIP39 from "bip39"; // Make sure to install the bip39 package

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private divs: number = 40;
  private pad: number = 3;
  private gravity: number = 0.14;
  private unit_x: number;
  private unit_y: number;
  private coinTotal: number = 10;
  private coinCount: number = 0;
  private keyTimings: { key: string; time: number }[] = [];
  private keysPressed: { [key: string]: boolean } = {};
  private player!: Player;
  private platforms: Platform[] = [];
  private coins: Coin[] = [];
  private particles: Particle[] = [];
  private mnemonic: string | null = null;
  private hasWon: boolean = false;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.unit_x = this.canvas.width / this.divs;
    this.unit_y = this.canvas.height / this.divs;
    this.registerEventListeners();
    this.generateStage();
  }

  registerEventListeners() {
    window.addEventListener("keydown", (event) => {
      if (!this.keysPressed[event.code]) {
        this.keysPressed[event.code] = true;
        this.keyTimings.push({ key: event.code, time: performance.now() });
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keysPressed[event.code] = false;
    });
  }

  isObjectOverlap(newObject: any, objects: any[], padding = 0) {
    return objects.some(
      (object) =>
        newObject.x + newObject.width + padding > object.x &&
        newObject.x < object.x + object.width + padding &&
        newObject.y + newObject.height + padding > object.y &&
        newObject.y < object.y + object.height + padding
    );
  }

  generateStage() {
    // Create player
    this.player = new Player(
      0,
      0,
      this.unit_x,
      this.unit_y,
      this.canvas.width,
      this.canvas.height,
      this.gravity
    );

    // Generate platforms
    const numberOfPlatforms = getRandomInt(10, 15); // Adjust this value to control the number of platforms
    let placedPlatforms = 0;

    while (placedPlatforms < numberOfPlatforms) {
      const x = getRandomInt(this.pad, this.divs - this.pad);
      const y = getRandomInt(this.pad, this.divs - this.pad);

      const newPlatform = new Platform(
        x * this.unit_x,
        y * this.unit_y,
        this.unit_x,
        this.unit_y
      );

      if (!this.isObjectOverlap(newPlatform, this.platforms, 10)) {
        this.platforms.push(newPlatform);
        placedPlatforms++;
      }
    }

    // Generate coins
    for (let i = 0; i < this.coinTotal; i++) {
      let coinPosition;

      do {
        const x = getRandomInt(this.pad, this.divs - this.pad);
        const y = getRandomInt(this.pad, this.divs - this.pad);
        coinPosition = {
          x: x * this.unit_x,
          y: y * this.unit_y,
          width: this.unit_x,
          height: this.unit_y,
        };
      } while (
        this.isObjectOverlap(coinPosition, this.platforms) ||
        this.isObjectOverlap(coinPosition, this.coins)
      );

      this.coins.push(
        new Coin(coinPosition.x, coinPosition.y, this.unit_x, this.unit_y)
      );
    }
  }

  update(timestamp: number) {
    // Update player
    this.player.update(timestamp, this.platforms, this.keysPressed);

    // Check for coin collisions
    this.coins.forEach((coin, index) => {
      if (this.player.collidesWith(coin)) {
        this.coins.splice(index, 1);
        this.particles.push(
          ...coin.createParticles(
            10,
            this.canvas.width,
            this.canvas.height,
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            this.gravity
          )
        );

        this.coinCount++;
        if (this.coinCount === this.coinTotal) {
          this.win();
        }
      }
    });

    // Remove particles
    this.particles = this.particles.filter((particle) => {
      particle.update(this.platforms);
      return particle.lifeSpan < 200;
    });
  }

  drawGrid() {
    const gridxSize = this.canvas.width / this.divs;
    const gridySize = this.canvas.height / this.divs;
    const gridOpacity = 0.1;

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.canvas.width; x += gridxSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.height; y += gridySize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw background grid
    this.drawGrid();

    // Render platforms
    this.platforms.forEach((platform) => platform.render(ctx));

    // Render coins
    this.coins.forEach((coin) => coin.render(ctx));

    // Render player
    this.player.render(ctx);

    // Render particles
    this.particles.forEach((particle) => particle.render(ctx));

    if (this.hasWon) {
      this.drawCongratulations();
    }
  }

  drawCongratulations() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Great play!",
      this.canvas.width / 2,
      this.canvas.height / 2 - 140
    );

    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      "Here your unique mnemonic:",
      this.canvas.width / 2,
      this.canvas.height / 2 - 100
    );

    const words = this.mnemonic?.split(" ");
    if (words) {
      this.ctx.font = "16px Arial";
      this.ctx.textAlign = "left";

      for (let i = 0; i < 12; i++) {
        const word1 = i + 1 + ". " + words[i];
        const word2 = i + 13 + ". " + words[i + 12];

        this.ctx.fillText(
          word1,
          this.canvas.width / 2 - 100,
          this.canvas.height / 2 - 60 + i * 20
        );
        this.ctx.fillText(
          word2,
          this.canvas.width / 2 + 20,
          this.canvas.height / 2 - 60 + i * 20
        );
      }
    }
  }

  win() {
    this.hasWon = true;
    const seed = generateRandomSeed(this.keyTimings);
    const seedBuffer = Buffer.from(seed.buffer); // Convert Uint8Array to Buffer
    this.mnemonic = BIP39.entropyToMnemonic(seedBuffer);
  }
  
}
