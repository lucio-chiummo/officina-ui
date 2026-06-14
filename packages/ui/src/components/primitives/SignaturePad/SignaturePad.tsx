import { useRef, useState, type PointerEvent } from 'react';

import { Button } from '../Button';

export type SignaturePadProps = {
  /** Called with a PNG data URL whenever the signature changes. */
  onChange: (dataUrl: string) => void;
  /** Label for the clear button. */
  clearLabel?: string;
};

export function SignaturePad({ onChange, clearLabel = 'Clear' }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'currentColor';
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
    onChange(canvas.toDataURL('image/png'));
  };
  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={640}
        height={180}
        className="h-44 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-fg-base)]"
        onPointerDown={(event) => {
          setDrawing(true);
          const ctx = canvasRef.current?.getContext('2d');
          const rect = event.currentTarget.getBoundingClientRect();
          ctx?.beginPath();
          ctx?.moveTo(event.clientX - rect.left, event.clientY - rect.top);
        }}
        onPointerMove={draw}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const canvas = canvasRef.current;
          canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
          if (canvas) onChange(canvas.toDataURL('image/png'));
        }}
      >
        {clearLabel}
      </Button>
    </div>
  );
}
