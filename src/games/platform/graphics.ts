export type Color = "black" | "white" | "green" | "blue" | "red" | "yellow";

interface Colors {
  [key: string]: string;
}

export function draw4BitRectangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: Color = "white",
  opacity: number = 0.5
): void {
  const colors: Colors = {
    black: "#000000",
    white: "#FFFFFF",
    green: "#008000",
    blue: "#0000FF",
    red: "#FF0000",
    yellow: "#FFFF00",
  };

  const borderColor = colors[color] || "#000";
  const fillColor = borderColor + opacityToHex(opacity); // Convert opacity to a 2-digit hex value

  // Draw the fill with the specified opacity
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width, height);

  // Draw the border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
}

export function opacityToHex(opacity: number): string {
  const hex = Math.round(opacity * 255).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
