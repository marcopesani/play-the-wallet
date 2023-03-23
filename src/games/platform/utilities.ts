export function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

interface KeyPressed {
  [key: string]: boolean;
}

let keysPressed: KeyPressed = {};

window.addEventListener("keydown", (event: KeyboardEvent) => {
  keysPressed[event.code] = true;
});

window.addEventListener("keyup", (event: KeyboardEvent) => {
  keysPressed[event.code] = false;
});

export function isKeyPressed(keyCode: string): boolean {
  return keysPressed[keyCode] || false;
}

interface KeyTiming {
  key: string;
  time: number;
}

export function generateRandomSeed(keyTimings: KeyTiming[]): Uint8Array {
  const keyTimingsString = keyTimings
    .map(({ key, time }) => key + time)
    .join("");

  const seed = new Uint8Array(32);
  for (let i = 0, j = 0; i < keyTimingsString.length; i++, j = (j + 1) % 32) {
    seed[j] ^= keyTimingsString.charCodeAt(i);
  }

  return seed;
}
