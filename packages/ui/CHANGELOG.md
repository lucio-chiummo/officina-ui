# @officina/ui

## 0.2.1

### Patch Changes

- 679a2f0: Fix React Server Component compatibility and eleven defects in the exported hooks.

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

## 0.2.0

### Minor Changes

- 086af92: Improve form-control prop coverage and expose the full hooks set.

  **FormControl prop completeness** — every leaf primitive now accepts `id`, `name`, `invalid`, `aria-describedby`, `onBlur`, `onFocus`, and forwards a `ref` to its focusable element:

  - `NumberInput`: add `id`/`name`/`required`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `MaskedInput`: forward `ref`, add `id`/`name`/`required`/`onBlur`/`onFocus`/`aria-describedby`.
  - `TagInput`: forward `ref`, add `id`/`name`/`disabled`/`required`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`; disabled now propagates to tag-remove and suggestion buttons.
  - `PinInput`: forward `ref`, add `id`/`name`/`required`/`onBlur`/`onFocus` (had `invalid`/`aria-describedby` already).
  - `Checkbox`: forward `ref`, add `name`/`required`/`invalid`/`onBlur`/`onFocus`.
  - `Switch`: forward `ref`, add `name`/`required`/`invalid`/`onBlur`/`onFocus`.
  - `RadioGroup`: forward `ref` (generic pattern), add `id`/`required`/`invalid`/`onBlur`/`onFocus`.
  - `Combobox`: add `required`/`invalid`/`aria-describedby`/`onBlur`/`onFocus` to the underlying input.
  - `MultiSelect`: forward `ref`, add `id`/`name`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `Rating`: forward `ref`, add `id`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `Slider`/`RangeSlider`: forward `ref`, add `id`/`name`/`disabled`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`; ARIA attributes correctly placed on the Thumb (where Radix assigns `role="slider"`), not Root.
  - `ColorPicker`: forward `ref`, export `ColorPickerProps`, add `id`/`name`/`disabled`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `DatePicker`: forward `ref`, add `name`/`disabled`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `FileUpload`: export `FileUploadProps`, add `id`/`name`/`required`/`invalid`/`aria-describedby`/`onBlur`/`onFocus`.
  - `PhoneInput`: forward `ref`, add `id`/`invalid`/`aria-describedby`/`required`/`onBlur`/`onFocus`.
  - `SearchInput`/`PasswordInput`: add `invalid` prop with `aria-invalid` and danger-border styling.
  - `CurrencyInput`: forward `ref`, inherit all `NumberInput` props instead of a hand-written subset.

  **ARIA correctness**: `aria-required` and `aria-invalid` are omitted from `role="button"` elements (ColorPicker, DatePicker, MultiSelect triggers) since the button role does not support them per WAI-ARIA. `aria-required` is also omitted from `role="slider"` elements (Slider, RangeSlider, Rating) for the same reason.

  **Hooks**:

  - Fix `useCopyToClipboard`: clear stale reset timers so an earlier copy's timeout can't clobber a later one, clean up on unmount, and resolve to a `boolean` so callers can react to a failed copy. `CopyButton`, `CopyField`, and `MetadataList`'s inline copy action now share this hook instead of duplicating the logic.
  - Fix `useClickOutside`'s ref type to `RefObject<T | null>`, matching what `useRef<T>(null)` actually returns.
  - Consolidate the two `useMediaQuery` implementations into one SSR-safe hook, with `useIsMobile`/`useIsTablet`/`useIsDesktop`/`usePrefersDark`/`usePrefersReducedMotion` convenience wrappers.
  - Expose the full set of utility hooks from `@officina/ui`'s root export.

  **Other**:

  - Export `DrawerProps`/`SheetProps`/`ConfirmDialogProps` from the `Dialog` barrel.
