interface ICollidable {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY?: number;
  canvasHeight?: number;
}

export function applyGravity(object: ICollidable, gravity: number): void {
  object.velocityY = (object.velocityY ?? 0) + gravity;
}

export function checkPlatformCollision(
  object: ICollidable,
  platforms: ICollidable[]
): boolean {
  let onGround = false;

  if (
    object.canvasHeight !== undefined &&
    object.y + object.height >= object.canvasHeight
  ) {
    object.y = object.canvasHeight - object.height;
    object.velocityY = 0;
    onGround = true;
  }

  platforms.forEach((platform) => {
    if (collidesWith(object, platform)) {
      object.y =
        object.velocityY! > 0
          ? platform.y - object.height
          : platform.y + platform.height;
      object.velocityY = 0;
      onGround = true;
    }
  });

  return onGround;
}

export function collidesWith(a: ICollidable, b: ICollidable): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
