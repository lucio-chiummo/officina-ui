import { Highlight, themes } from 'prism-react-renderer';

import { CopyButton } from '../CopyButton';

export type CodeBlockProps = {
  /** Source code to render. */
  code: string;
  /** Language for syntax highlighting (e.g. "ts", "bash"). */
  language?: string;
  /** Show a line-number gutter. */
  showLineNumbers?: boolean;
  /** Show a copy-to-clipboard button. */
  showCopy?: boolean;
  /** Max height in pixels before the block scrolls. */
  maxHeight?: number;
};

export function CodeBlock({
  code,
  language = 'tsx',
  showLineNumbers,
  showCopy = true,
  maxHeight,
}: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-base)]">
      {showCopy ? (
        <div className="flex justify-end border-b border-[var(--color-border)] p-2">
          <CopyButton value={code} />
        </div>
      ) : null}
      <Highlight theme={themes.github} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-auto bg-[var(--color-bg-muted)] p-4 text-xs`}
            style={{ ...style, maxHeight }}
          >
            {tokens.map((line, i) => (
              // eslint-disable-next-line react/no-array-index-key -- Prism returns positional token arrays.
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers ? (
                  <span className="mr-4 select-none text-[var(--color-fg-subtle)]">{i + 1}</span>
                ) : null}
                {line.map((token, key) => (
                  // eslint-disable-next-line react/no-array-index-key -- Prism tokens have no stable ids.
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
