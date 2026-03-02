# aegir-eldir — Claude Context

Drupal 11 theme for the Aegir hosting system. This is the **presentation layer only** — a theme, not a module.

## Repository Position

This is a git submodule of the root repo at `/var/aegir/drupal/aegir-2601/`.
Active branch: `dev/d11-new`

| Component | Path |
|-----------|------|
| Root repo | `/var/aegir/drupal/aegir-2601/` |
| **This theme** | `web/themes/contrib/aegir-eldir/` |
| Hosting module | `web/modules/contrib/aegir-hosting/` |
| Provision backend | `vendor/argopecten/aegir-provision/` |

## What Lives Here

- `eldir.theme` — 24 preprocess functions + `eldir_theme()` (no PHP classes, no `src/`)
- `css/` — 6 files (~3,889 lines): variables → base → layout → components → aegir → responsive
- `js/eldir.js` — 9 `Drupal.behaviors.*` (313 lines)
- `templates/` — 21 Twig files including 4 component templates in `templates/components/`

## Hard Rules

- **No PHP classes** — all PHP in `eldir.theme` only
- **No business logic in preprocess** — formatting, classes, variable prep only
- **BEM naming**: `.hosting-server__header--active`
- **CSS custom properties**: `var(--aegir-color-*)`, `var(--aegir-spacing-*)` — never hardcoded values
- **`once()` in all JS behaviors** — required for AJAX/BigPipe compat
- **Mobile-first**: `min-width:` media queries only
- **WCAG AA** accessibility required
- **Base theme: false** — Eldir is standalone
- **No `declare(strict_types=1)`** in `.theme` files

## CSS File Map

| File | Purpose |
|------|---------|
| `variables.css` | CSS custom properties (design tokens) |
| `base.css` | HTML element resets |
| `layout.css` | Grid layout, sidebar regions |
| `components.css` | Reusable BEM components |
| `aegir.css` | Hosting entity/page styles |
| `responsive.css` | `@media` overrides |

## Breakpoints

`0 / 768px / 1024px / 1280px / 1600px` (mobile-first `min-width:`)

## Custom Theme Hooks

| Hook | Template |
|------|---------|
| `hosting_status_badge` | `components/hosting-status-badge` |
| `hosting_panel` | `components/hosting-panel` |
| `hosting_task_card` | `components/hosting-task-card` |
| `hosting_entity_chip` | `components/hosting-entity-chip` |

## Page Routing

- Routes `hosting.*` / `entity.hosting_*` → `page--hosting.html.twig` (sidebar layout)
- `entity.hosting_*.canonical` → default `page.html.twig` (entity renders its own sidebar)

## Template Naming

Underscores → hyphens: `hosting_server` entity → `hosting-server.html.twig`

## After Any Theme Change

```bash
drush cr
```

## Available Skills (slash commands)

- `/create-template` — create a Twig template or component
- `/add-css` — add styles (BEM + CSS custom properties)
- `/add-js-behavior` — add a JS behavior to `eldir.js`
- `/debug-theme` — diagnose template/style/JS issues
- `/coding-standards` — display theme coding standards
- `/cross-repo` — cross-submodule commit workflow
- `/wiki-sync` — doc editing and wiki sync rules

## Known Issues

- No `hosting-platform.html.twig` (preprocess exists but no template)
- No automated visual regression tests
- SDC migration planned (see `doc/TODO.md`)
