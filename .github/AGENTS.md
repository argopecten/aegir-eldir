# AI Agent Guide — aegir-eldir (Theme)

> **Repository**: Drupal 11 theme for Aegir hosting system
> **Local Path**: `web/themes/contrib/aegir-eldir/`
> **GitHub**: https://github.com/argopecten/aegir-eldir

## You Are Here

This is the **Theme Component** — a Drupal theme (NOT a module). It contains Twig templates, CSS, JS, and preprocess functions. No PHP classes, no `src/` directory, no services.

**This component handles**:
- ✅ Twig templates (21 files — pages, entities, components)
- ✅ CSS architecture (6 files, ~3,889 lines — custom properties, BEM, responsive)
- ✅ JavaScript behaviors (9 behaviors, 313 lines)
- ✅ Preprocess functions (24 functions in `eldir.theme`)
- ✅ Custom theme hooks (4 component-level hooks)
- ❌ Entity logic (→ aegir-hosting)
- ❌ Form validation (→ aegir-hosting)
- ❌ Backend operations (→ aegir-provision)

## Architecture

```
Drupal Render API → Theme Layer
    ↓
eldir.theme (24 preprocess functions)
    ↓
templates/ (21 Twig files)
    ↓
css/ (6 files) + js/ (1 file, 9 behaviors)
```

### File Tree

```
eldir.info.yml              # Theme definition, base theme: false
eldir.theme                 # 24 preprocess functions + hook_theme()
eldir.libraries.yml         # Single library: eldir/global-styling
eldir.breakpoints.yml       # 5 breakpoints (0, 768, 1024, 1280, 1600)
eldir.settings.yml          # Theme settings defaults
config/
├── install/
│   ├── block.block.eldir_main_menu.yml
│   └── block.block.eldir_secondary_menu.yml
└── schema/eldir.schema.yml
css/
├── variables.css           # CSS custom properties (284 lines)
├── base.css                # Reset/normalize (266 lines)
├── layout.css              # Grid layout, sidebar regions (329 lines)
├── components.css          # BEM component styles (997 lines)
├── aegir.css               # Aegir-specific hosting styles (1671 lines)
└── responsive.css          # Media query overrides (342 lines)
js/
└── eldir.js                # 9 Drupal.behaviors (313 lines)
templates/
├── html.html.twig          # HTML wrapper
├── page.html.twig          # Default page layout
├── page--hosting.html.twig # Hosting pages (with sidebar)
├── page--user--login.html.twig
├── page--user--password.html.twig
├── page--user--register.html.twig
├── node.html.twig          # Node display
├── block.html.twig         # Block wrapper
├── region.html.twig        # Region wrapper
├── menu--main.html.twig    # Main navigation
├── menu--secondary.html.twig
├── hosting-server.html.twig    # Server entity display
├── hosting-site.html.twig      # Site entity display
├── hosting-task.html.twig      # Task entity display
├── hosting-queues-table.html.twig
├── hosting-service-status-cell.html.twig
└── components/
    ├── hosting-status-badge.html.twig  # Status indicator
    ├── hosting-panel.html.twig         # Collapsible panel
    ├── hosting-task-card.html.twig     # Task summary card
    └── hosting-entity-chip.html.twig   # Inline entity reference
```

## CSS Architecture

### File Loading Order (via `eldir.libraries.yml`)

| Layer | File | SMACSS Category | Weight |
|-------|------|----------------|--------|
| 1 | `variables.css` | Custom Properties | -100 |
| 2 | `base.css` | Base/Reset | default |
| 3 | `layout.css` | Layout (grid, sidebar) | layout |
| 4 | `components.css` | Components (BEM) | component |
| 5 | `aegir.css` | Theme (hosting-specific) | theme |
| 6 | `responsive.css` | Media Queries | theme |

### CSS Custom Properties (variables.css)

All theming goes through CSS custom properties defined in `:root`:
- `--aegir-color-*` — Color palette
- `--aegir-spacing-*` — Margins/padding
- `--aegir-font-*` — Typography
- `--aegir-radius-*` — Border radius
- `--aegir-shadow-*` — Box shadows
- `--aegir-transition-*` — Transitions

### BEM Naming Convention

```css
.hosting-server { }              /* Block */
.hosting-server__header { }      /* Element */
.hosting-server--disabled { }    /* Modifier */
```

## Breakpoints (5)

| Name | Query | Use |
|------|-------|-----|
| `eldir.mobile` | `min-width: 0px` | Base/mobile-first |
| `eldir.tablet` | `min-width: 768px` | Tablet |
| `eldir.desktop` | `min-width: 1024px` | Desktop (sidebar appears) |
| `eldir.wide` | `min-width: 1280px` | Wide desktop |
| `eldir.ultrawide` | `min-width: 1600px` | Ultra-wide |

**Note**: Breakpoints are 0/768/1024/1280/1600 — NOT 360/768/1024/1440/1920 as some docs claim.

## JavaScript Behaviors (9)

| Behavior | Purpose |
|----------|---------|
| `eldirSmoothScroll` | Smooth scroll for anchor links |
| `eldirResponsiveTables` | Make tables responsive on mobile |
| `eldirMobileNav` | Mobile navigation toggle |
| `eldirFormEnhancement` | Enhanced form interactions |
| `eldirAutoExpandTextarea` | Auto-growing textareas |
| `eldirLiveTaskStatus` | Live task status polling |
| `eldirCollapsible` | Collapsible panel behavior |
| `eldirActiveTrail` | Active menu trail highlighting |
| `eldirCopyCode` | Copy code block to clipboard |

All behaviors use `Drupal.behaviors.*` pattern with `once()` for attach/detach safety.

## Preprocess Functions (24)

### Core Preprocess
- `eldir_theme()` — registers 4 custom theme hooks
- `eldir_theme_suggestions_page_alter()` — adds `page__hosting` for hosting routes
- `eldir_preprocess_html()` — body classes (aegir, wide, not-logged-in, node type)
- `eldir_preprocess_page()` — page variables, navigation
- `eldir_preprocess_node()` — node template variables

### Entity Preprocess
- `eldir_preprocess_entity__hosting_server()` — server view variables
- `eldir_preprocess_entity__hosting_site()` — site view variables
- `eldir_preprocess_entity__hosting_client()` — client view variables
- `eldir_preprocess_entity__hosting_task()` — task view variables
- `eldir_preprocess_hosting_site()` — site-specific overrides
- `eldir_preprocess_hosting_platform()` — platform-specific overrides
- `eldir_preprocess_hosting_server()` — server-specific overrides

### Component Preprocess
- `eldir_preprocess_hosting_status_badge()` — status colors/icons
- `eldir_preprocess_hosting_panel()` — collapsible panel state
- `eldir_preprocess_hosting_task_card()` — task card rendering
- `eldir_preprocess_hosting_entity_chip()` — entity chip rendering

### UI Element Preprocess
- `eldir_preprocess_menu__main()` — main menu rendering
- `eldir_preprocess_menu_local_tasks()` — tabs rendering
- `eldir_preprocess_table()` — table enhancements
- `eldir_preprocess_form()` — form classes
- `eldir_preprocess_form_element()` — form element wrapper

### Utility Functions
- `eldir_form_system_theme_settings_alter()` — theme settings form
- `eldir_build_menu()` — menu rendering helper
- `eldir_add_entity_metadata_attributes()` — data attributes for JS

## Custom Theme Hooks (4)

Defined in `eldir_theme()`, usable via `{{ theme('hook_name', {vars}) }}`:

| Hook | Template | Variables |
|------|----------|-----------|
| `hosting_status_badge` | `components/hosting-status-badge` | `status`, `label`, `icon`, `attributes` |
| `hosting_panel` | `components/hosting-panel` | `title`, `content`, `collapsible`, `collapsed`, `actions`, `attributes` |
| `hosting_task_card` | `components/hosting-task-card` | `task_id`, `task_type`, `status`, `timestamp`, `description`, `site`, `platform`, `log`, `attributes` |
| `hosting_entity_chip` | `components/hosting-entity-chip` | `entity_type`, `entity_id`, `label`, `url`, `status`, `icon`, `attributes` |

## Regions (8)

```
┌─────────────────────────────────────────────┐
│                 navigation                   │
├─────────────────────────────────────────────┤
│                   header                     │
├─────────────────────────────────────────────┤
│                    help                      │
├──────────────────────┬──────────────────────┤
│                      │   sidebar_first       │
│      content         │   (Sidebar top)       │
│                      ├──────────────────────┤
│                      │   sidebar_second      │
│                      │   (Sidebar bottom)    │
├──────────────────────┴──────────────────────┤
│              content_bottom                  │
├─────────────────────────────────────────────┤
│                   footer                     │
└─────────────────────────────────────────────┘
```

## Page Suggestion System

The `eldir_theme_suggestions_page_alter()` function routes hosting pages:

- Routes starting with `hosting.` or `entity.hosting_` → `page--hosting.html.twig`
- **Exception**: Entity canonical pages (`entity.hosting_*.canonical`) → default `page.html.twig` (they render their own sidebar)

## Development Rules

1. **No PHP classes** — this is a theme, not a module. No `src/` directory.
2. **No business logic** in preprocess — only formatting, classes, and variable prep
3. **BEM naming** for all CSS classes: `.block__element--modifier`
4. **CSS custom properties** for all colors/spacing/typography — no hardcoded values
5. **Mobile-first** responsive approach — base styles for mobile, media queries for larger
6. **`once()` in JS** — all behaviors must use `once()` for Drupal AJAX compatibility
7. **WCAG AA** accessibility compliance required
8. **Base theme**: `false` — Eldir is standalone (D11 pattern). 79 stable9 templates copied into `templates/` for markup ownership. Do not add a base theme dependency.
9. **SDC migration planned** — currently uses traditional template + hook pattern; migrate to Single Directory Components per [doc/TODO.md](../doc/TODO.md)
10. **Breaking changes allowed** — no backward compatibility

## Known Issues

- No `hosting-platform.html.twig` template — platforms render with generic entity template despite having a preprocess function
- Some preprocess functions use global `\Drupal::` calls instead of injected services (acceptable in themes)
- Use `\Drupal::service(ThemeSettingsProvider::class)->getSetting()` instead of deprecated `theme_get_setting()`
- No automated visual regression tests

## Statistics

| Metric | Count |
|--------|-------|
| Twig templates | 21 |
| CSS files | 6 (~3,889 lines) |
| JS file | 1 (313 lines) |
| JS behaviors | 9 |
| Preprocess functions | 24 |
| Custom theme hooks | 4 |
| Regions | 8 |
| Breakpoints | 5 |
| Config files | 3 |
| PHP classes | **0** |
| Tests | **0** |

## Related Components

| Component | Path | When to reference |
|-----------|------|-------------------|
| Hosting (Frontend) | `web/modules/contrib/aegir-hosting/` | Entity fields, render arrays, theme hooks |
| Provision (Backend) | `vendor/argopecten/aegir-provision/` | Understanding what data exists |
| Main repo | `.github/AGENTS.md` | Cross-component architecture |
