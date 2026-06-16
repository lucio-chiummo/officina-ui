# Contributing to Officina UI

Thanks for taking the time to contribute.

## Getting started

```bash
pnpm install
pnpm build:ui      # build the library once so the docs app can resolve it
pnpm dev:docs      # run the docs site against the built library
```

## Before opening a PR

```bash
pnpm format:check  # prettier --check .
pnpm typecheck
pnpm test
pnpm build
```

All four run in CI and must pass before a PR can merge.

## Adding a changeset

Any change to `packages/ui` that should be released needs a changeset:

```bash
pnpm changeset
```

Follow the prompts to pick a bump type (patch/minor/major) and describe the
change — this becomes the changelog entry.

## Commit / PR conventions

- Keep PRs focused on a single change.
- Describe the "why", not just the "what" — the diff already shows what
  changed.
- New or changed component behavior should come with a corresponding test in
  `packages/ui/src/components/primitives/**/*.test.tsx`.

## Reporting bugs / requesting features

Open a GitHub issue using the provided templates. For security
vulnerabilities, see [SECURITY.md](./SECURITY.md) instead of opening a public
issue.
