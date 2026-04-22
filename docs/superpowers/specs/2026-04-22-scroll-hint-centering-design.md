# Scroll-hint centering fix

**Date:** 2026-04-22
**Scope:** Single CSS property change in `app/page.tsx`

## Problem

The `.scroll-hint` element at the bottom of the hero on the landing page sits slightly right of center relative to the rest of the page.

## Cause

`.scroll-hint` uses `letter-spacing: 0.4em` on the word "Scroll". CSS letter-spacing is added as trailing space after every character, including the last one. This trailing space is included in the element's bounding box, so when the element is centered via `left: 50%; transform: translateX(-50%)`, the visible glyphs are not centered within that box — they shift visually off-center relative to the 1px arrow below them (which is true-centered via `margin: auto`). The resulting asymmetry between text and arrow is what reads as "not centered."

## Change

In the `.scroll-hint` rule in `app/page.tsx` (currently at line 391), add `text-indent: 0.4em` to compensate for the trailing letter-spacing so the visible text is horizontally centered under the arrow.

Before:
```css
.scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  /* ... */
  letter-spacing: 0.4em;
  /* ... */
}
```

After:
```css
.scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  /* ... */
  letter-spacing: 0.4em;
  text-indent: 0.4em;
  /* ... */
}
```

## Alternatives considered

- **Negative `margin-left` on `.scroll-hint`** — shifts the whole element, including the arrow, so the arrow/text misalignment remains. Rejected.
- **Wrapping "Scroll" in a `<span>` with `margin-right: -0.4em`** — works but adds markup and two style rules for no visible benefit over `text-indent`. Rejected.
- **Reducing `letter-spacing`** — changes the typographic intent of the design. Out of scope.

## Out of scope

- Animation timing or sequencing on the landing page
- Overall page-load performance
- Any other element's positioning

## Success criteria

- The word "Scroll" and the 1px arrow below it share the same horizontal center when viewed in a modern browser on desktop and mobile.
- No regressions to the existing rise animation on `.scroll-hint`.
- No change in layout, spacing, or visual design of any other element.
