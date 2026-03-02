---
name: eldir-add-css-styles
description: Add or modify styles in Eldir with correct file placement, BEM naming, CSS custom properties, and mobile-first responsive rules. Use when implementing visual/UI updates in the theme.
---

# Eldir Add CSS Styles

1. Select the correct stylesheet:
   - `css/variables.css`: new design tokens/custom properties.
   - `css/base.css`: base element styles.
   - `css/layout.css`: page/grid/region structure.
   - `css/components.css`: reusable components.
   - `css/aegir.css`: Aegir-specific entity/page styling.
   - `css/responsive.css`: breakpoint overrides.
2. Use BEM classes matching template markup.
3. Use `var(--aegir-...)` properties instead of hardcoded values.
4. Keep base styles mobile-first, then layer breakpoints from `eldir.breakpoints.yml`.
5. Avoid selector sprawl; prefer component-scoped styles.

## Breakpoints

- `768px`, `1024px`, `1280px`, `1600px` (min-width).
