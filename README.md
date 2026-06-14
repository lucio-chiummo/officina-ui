# Officina UI

The complete Officina React component library — 250+ primitives, token-driven
theming, and composable components, shipped as a single install.

- **Package:** `@officina/ui` (MIT)
- **Docs:** live demos + API reference for every component (`apps/docs`)

## Install

```bash
pnpm add @officina/ui react react-dom
```

Import the token and component CSS once in your app entry:

```tsx
import '@officina/ui/tokens.css';
import '@officina/ui/styles.css';
```

`tokens.css` must load before `styles.css` so component styles can read the
semantic variables.

## Usage

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@officina/ui';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Invite member</Button>
      </CardContent>
    </Card>
  );
}
```

Some components have optional peer dependencies (TanStack Table/Query/Router)
that are only required by the components that use them.

## Repository layout

```
packages/ui     # @officina/ui — the published component library
apps/docs       # documentation site (Next.js + fumadocs)
```

## Develop

```bash
pnpm install
pnpm build:ui      # build the library
pnpm dev:docs      # run the docs site against the built library
```

## License

MIT © Lucio Chiummo
