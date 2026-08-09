export type DiffViewerProps = {
  oldValue: string;
  newValue: string;
};

export function DiffViewer({ oldValue, newValue }: DiffViewerProps) {
  const oldLines = oldValue.split('\n');
  const newLines = newValue.split('\n');
  const max = Math.max(oldLines.length, newLines.length);
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] font-mono text-xs">
      <div className="grid grid-cols-2 border-b border-[var(--color-border)] bg-[var(--color-bg-muted)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
        <span>Before</span>
        <span>After</span>
      </div>
      {Array.from({ length: max }).map((_, index) => {
        const oldLine = oldLines[index] ?? '';
        const newLine = newLines[index] ?? '';
        const changed = oldLine !== newLine;
        return (
          <div key={`diff-${String(index + 1)}`} className="grid grid-cols-2">
            <pre className={changed ? 'bg-[var(--color-danger-muted)] px-3 py-1' : 'px-3 py-1'}>
              {oldLine || ' '}
            </pre>
            <pre className={changed ? 'bg-[var(--color-success-muted)] px-3 py-1' : 'px-3 py-1'}>
              {newLine || ' '}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
