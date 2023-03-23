import React, { useEffect, useRef } from "react";
import Game from "@/games/platform/game"; // Import the Game class if it's in a separate file

export default function PlatformGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = new Game(canvas, ctx);

    // Main game loop
    function gameLoop(timestamp: number) {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update(timestamp);
      game.render(ctx);

      // Store the animation frame request ID
      const animationFrameRequestId = requestAnimationFrame(gameLoop);
    }

    // Start the game loop and store the animation frame request ID
    const initialAnimationFrameRequestId = requestAnimationFrame(gameLoop);

    // Clean up when the component is unmounted
    return () => {
      // Use the stored animation frame request ID to cancel the animation frame
      cancelAnimationFrame(initialAnimationFrameRequestId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="game-canvas"
        width="400"
        height="400"
      ></canvas>
    </>
  );
}
