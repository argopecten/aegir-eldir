Display and apply the aegir-eldir theme coding standards. Use before implementing, refactoring, or reviewing code in this theme.

## PHP (eldir.theme only — no PHP classes in themes)

- No `declare(strict_types=1)` in `.theme` files (they are not standard PHP files)
- Type hints on all function parameters and return types: `function eldir_preprocess_page(array &$variables): void`
- No `src/` directory — all PHP lives in `eldir.theme`
- Preprocess functions: formatting only — no entity saves, no business logic, no DB queries
- Use `\Drupal::service()` is acceptable in `.theme` files (unlike modules)
- Use `\Drupal::service(ThemeSettingsProvider::class)->getSetting()` instead of deprecated `theme_get_setting()`

## CSS Standards

- **BEM methodology**: `.block__element--modifier` for all new classes
  ```css
  .hosting-server { }              /* Block */
  .hosting-server__header { }      /* Element */
  .hosting-server--disabled { }    /* Modifier */
  ```
- **CSS custom properties for ALL design tokens** — zero hardcoded colors, spacing, fonts, radii
  ```css
  /* ✅ */ color: var(--aegir-color-text);
  /* ❌ */ color: #333;
  ```
- **Mobile-first**: base styles for mobile, `min-width:` media queries for larger screens
- Breakpoints: `768px / 1024px / 1280px / 1600px`

## CSS File Placement

| Content | File |
|---------|------|
| New CSS custom properties | `variables.css` |
| HTML element resets | `base.css` |
| Page/grid layout | `layout.css` |
| Reusable component styles | `components.css` |
| Hosting entity/page styles | `aegir.css` |
| Media query overrides | `responsive.css` |

## JavaScript Standards

- **`once()` in ALL JS behaviors** — required for AJAX/BigPipe compatibility
  ```javascript
  once('eldir-my-thing', '.selector', context).forEach((el) => { ... });
  ```
- **Use `context` parameter** — not `document`
- **ES6+** — no jQuery dependency
- **`Drupal.behaviors.*` pattern** — all behaviors in `js/eldir.js`
- **`data-*` attributes** for JS hooks — not CSS classes
- Implement `detach()` when using timers or external event listeners

## Twig Standards

- Document all available variables at file top with `@file` docblock
- Use `{{ attributes }}` object (never string-concatenate attribute strings)
- Meaningful indentation (2 spaces)
- Component reuse via theme hooks: `{{ theme('hosting_status_badge', { status: status }) }}`
- Template naming: entity type underscores → hyphens (`hosting_server` → `hosting-server.html.twig`)

## Accessibility (WCAG AA Required)

- Semantic HTML elements (`article`, `header`, `nav`, `aside`, `main`)
- ARIA labels on interactive elements without visible text
- Keyboard navigation for all interactive components
- Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Focus visible indicators

## CSS Naming Convention

| What | Pattern | Example |
|------|---------|---------|
| CSS block | `.hosting-{block}` | `.hosting-server` |
| CSS element | `.hosting-{block}__{element}` | `.hosting-server__header` |
| CSS modifier | `.hosting-{block}--{modifier}` | `.hosting-server--disabled` |
| Template | `hosting-{type}.html.twig` | `hosting-site.html.twig` |
| Component template | `components/{name}.html.twig` | `components/hosting-status-badge.html.twig` |

## Pre-Commit Checklist

1. No hardcoded colors/spacing in CSS — use `var(--aegir-*)`
2. All new JS behaviors use `once()`
3. All template variables documented at top of Twig file
4. Preprocess functions contain no business logic
5. BEM naming used throughout
6. `drush cr` clears cache and renders correctly
7. Accessible markup (semantic HTML, ARIA where needed)
