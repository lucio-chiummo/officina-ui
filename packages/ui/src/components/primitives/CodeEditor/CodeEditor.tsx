import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { cn } from '@lib/utils/cn';
import ReactCodeMirror, { type Extension } from '@uiw/react-codemirror';

export type CodeEditorLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'css'
  | 'html'
  | 'json'
  | 'markdown';

export type CodeEditorProps = {
  /** Current editor contents. */
  value: string;
  /** Called with the new contents on edit. */
  onChange?: (value: string) => void;
  /** Language for syntax highlighting. */
  language?: CodeEditorLanguage;
  /** Render read-only (no editing). */
  readOnly?: boolean;
  /** Fixed height (CSS length). */
  height?: string;
  /** Minimum height when auto-growing. */
  minHeight?: string;
  /** Colour theme; `auto` follows the app theme. */
  theme?: 'light' | 'dark' | 'auto';
  /** Show the line-number gutter. */
  lineNumbers?: boolean;
  /** Placeholder shown when empty. */
  placeholder?: string;
  className?: string;
};

const LANG_MAP: Record<CodeEditorLanguage, () => Extension> = {
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  python,
  css,
  html,
  json,
  markdown,
};

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '300px',
  minHeight,
  theme = 'auto',
  lineNumbers = true,
  placeholder,
  className,
}: CodeEditorProps) {
  const langExtension = LANG_MAP[language]();

  const resolvedTheme =
    theme === 'auto'
      ? typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? oneDark
        : 'light'
      : theme === 'dark'
        ? oneDark
        : 'light';

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm',
        className,
      )}
    >
      <ReactCodeMirror
        value={value}
        height={height}
        {...(minHeight !== undefined ? { minHeight } : {})}
        theme={resolvedTheme}
        extensions={[langExtension]}
        readOnly={readOnly}
        {...(placeholder !== undefined ? { placeholder } : {})}
        basicSetup={{ lineNumbers, foldGutter: true, autocompletion: true }}
        {...(onChange !== undefined ? { onChange } : {})}
        aria-label="Code editor"
      />
    </div>
  );
}
