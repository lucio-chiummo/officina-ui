---
'@officina/ui': patch
---

Fix React Server Component compatibility and eleven defects in the exported hooks.

The published bundle carried no `"use client"` directive: tsup's banner was set,
but `treeshake: true` adds a rollup pass that strips module-level directives, so
importing the package from a Next.js Server Component failed. The directive is
now reapplied after the build.

`ExportToolbar` called `useTranslation` unconditionally, which logged a
`NO_I18NEXT_INSTANCE` warning on every render in apps that do not use i18next.
It now translates only when the host app has initialised an instance and falls
back to its built-in labels otherwise.

Hook fixes:

- `useResizeObserver` and `useInfiniteScroll` rebuilt their observer on every
  render when passed an inline callback, re-firing the initial observation.
- `useEventListener` and `useIntersection` resubscribed on every render when
  passed an inline options object.
- `useCountdown` restarted its interval each tick, drifting behind real time.
- `usePagination` did not clamp the current page when `total` shrank.
- `useSelection` counted keys no longer present in `items` toward `allSelected`.
- `useIdleTimeout` fired `onActive` on every input event and on mount, rather
  than on the idle-to-active transition.
- `useScrollLock` cleared the body's original `padding-right` instead of
  restoring it.
- `useScrollPosition` reported `0` until the first scroll event.
- `useKeyPress` reported a key as held forever if the window lost focus
  mid-press.
