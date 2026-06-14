import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="border-fd-border text-fd-muted-foreground mb-4 rounded-full border px-3 py-1 text-xs font-medium">
        Open source · 250+ components
      </span>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        The most complete open-source React component library
      </h1>
      <p className="text-fd-muted-foreground mt-4 max-w-xl text-balance">
        Officina UI ships forms, data grids, overlays, charts, scheduling, and AI surfaces —
        token-driven, accessible, and fully typed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="bg-fd-primary text-fd-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium"
        >
          Get started
        </Link>
        <Link
          href="/docs/components/button"
          className="border-fd-border rounded-lg border px-5 py-2.5 text-sm font-medium"
        >
          Browse components
        </Link>
      </div>
    </main>
  );
}
