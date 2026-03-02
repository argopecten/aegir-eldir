Add or modify CSS styles in aegir-eldir following BEM and CSS custom property conventions.

## Step 1: Choose the Correct File

| File | When to Use |
|------|-------------|
| `css/variables.css` | New custom properties (colors, spacing, fonts, radii, shadows) |
| `css/base.css` | HTML element resets, normalize |
| `css/layout.css` | Page grid, sidebar regions, region positioning |
| `css/components.css` | Reusable BEM component styles |
| `css/aegir.css` | Hosting entity/page-specific styles |
| `css/responsive.css` | `@media (min-width: ...)` overrides |

## Step 2: Use CSS Custom Properties — Never Hardcode

```css
/* ✅ Correct */
.hosting-server__header {
    color: var(--aegir-color-text);
    padding: var(--aegir-spacing-md);
    border-radius: var(--aegir-radius-sm);
    background: var(--aegir-color-surface);
}

/* ❌ Wrong */
.hosting-server__header {
    color: #333;
    padding: 16px;
    border-radius: 4px;
    background: #fff;
}
```

Available token groups (defined in `css/variables.css`):
- `--aegir-color-*` — Color palette
- `--aegir-spacing-*` — Margins/padding (xs, sm, md, lg, xl)
- `--aegir-font-*` — Typography (size, weight, family)
- `--aegir-radius-*` — Border radius
- `--aegir-shadow-*` — Box shadows
- `--aegir-transition-*` — Transitions

## Step 3: Follow BEM Naming

```css
/* Block */
.hosting-task-card { }

/* Element */
.hosting-task-card__header { }
.hosting-task-card__status { }
.hosting-task-card__body { }

/* Modifier */
.hosting-task-card--error { }
.hosting-task-card__status--success { }
```

## Step 4: Responsive Overrides (mobile-first, min-width only)

Add to `css/responsive.css`:

```css
/* Breakpoints: 768px / 1024px / 1280px / 1600px */

@media (min-width: 768px) {
    .hosting-task-card {
        flex-direction: row;
    }
}

@media (min-width: 1024px) {
    .hosting-task-card {
        max-width: 800px;
    }
}
```

## Step 5: New Custom Properties

If adding a new design token, add to `css/variables.css` inside `:root { }`:

```css
:root {
    --aegir-color-new-thing: #value;
}
```

## After Changes

```bash
drush cr
```

Read the relevant CSS file first to understand existing patterns before adding new styles.
