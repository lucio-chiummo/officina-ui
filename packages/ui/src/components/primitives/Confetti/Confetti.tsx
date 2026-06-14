import { useEffect, useRef } from 'react';

export interface ConfettiProps {
  /** Fire the confetti burst when true. */
  run?: boolean;
  /** Number of confetti pieces. */
  pieces?: number;
  /** Height of the confetti canvas in px. */
  height?: number;
}

export function Confetti({ run = true, pieces = 80, height = 240 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !run) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.offsetWidth;
    canvas.width = width;
    canvas.height = height;
    const flakes = Array.from({ length: pieces }, (_, index) => ({
      x: (index * 37) % width,
      y: -((index * 19) % height),
      s: 4 + (index % 6),
      c: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'][index % 4],
    }));
    let frame = 0;
    let raf = 0;
    function draw() {
      if (!context || !canvas) return;
      context.clearRect(0, 0, width, height);
      flakes.forEach((flake, index) => {
        context.fillStyle = flake.c ?? '#6366f1';
        context.fillRect(
          flake.x + Math.sin((frame + index) / 12) * 12,
          (flake.y + frame * (1 + (index % 4) * 0.25)) % height,
          flake.s,
          flake.s * 1.6,
        );
      });
      frame += 1;
      if (frame < 180) raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [height, pieces, run]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none w-full"
      style={{ height }}
    />
  );
}
