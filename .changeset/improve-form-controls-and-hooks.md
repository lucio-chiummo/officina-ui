---
"@officina/ui": minor
---

Improve form-control prop coverage and expose the full hooks set.

- `NumberInput`: add `id`/`name`/`required`/`invalid`/`aria-describedby`/`onBlur`/`onFocus` so it integrates with `FormControl` and form libraries like the other form inputs.
- `MaskedInput`: forward `ref`, add `id`/`name`/`required`/`onBlur`/`aria-describedby`.
- `TagInput`: forward `ref` to the underlying text input.
- `PinInput`: add `invalid`/`aria-invalid`/`className`/`aria-describedby` support.
- Export `DrawerProps`/`SheetProps`/`ConfirmDialogProps` from the `Dialog` barrel.
- Fix `useCopyToClipboard`: clear stale reset timers so an earlier copy's timeout can't clobber a later one, clean up on unmount, and resolve to a `boolean` so callers can react to a failed copy. `CopyButton`, `CopyField`, and `MetadataList`'s inline copy action now share this hook instead of duplicating the logic.
- Fix `useClickOutside`'s ref type to `RefObject<T | null>`, matching what `useRef<T>(null)` actually returns.
- Consolidate the two `useMediaQuery` implementations into one SSR-safe hook, with `useIsMobile`/`useIsTablet`/`useIsDesktop`/`usePrefersDark`/`usePrefersReducedMotion` convenience wrappers.
- Expose the full set of utility hooks from `@officina/ui`'s root export.
