# Eldir Theme - Developer Guide (Drupal 11)

## Overview

Modern implementation of the Eldir theme for Drupal 11, preserving D7 visual identity while using modern CSS architecture and theming standards.

**Status**: Production ready

## Technical Stack

- **Templates**: Twig (`.html.twig`)
- **CSS**: Modern CSS with Custom Properties (CSS Variables)
- **Layout**: CSS Grid + Flexbox
- **JavaScript**: ES6+ with Drupal.behaviors
- **Responsive**: Mobile-first with 5 breakpoints
- **Accessibility**: WCAG AA compliant

## Architecture

### CSS Architecture

**Design Token System** (`css/variables.css`)
```css
:root {
  /* Colors */
  --color-primary: #16527f;
  --color-accent: #6ac;
  --color-header: #666;
  --color-border: #e8e8e8;
  
  /* Spacing (1rem = 16px) */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family-base: "Helvetica Neue", Arial, sans-serif;
  --font-size-base: 13px;
  --line-height-base: 1.54;
  
  /* Other */
  --border-radius: 4px;
  --transition-duration: 0.2s;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
}
```

**CSS Layer Structure**
1. `variables.css` - Design tokens
2. `base.css` - Reset, typography, forms
3. `layout.css` - Grid structure, regions
4. `components.css` - UI components
5. `aegir.css` - Hosting-specific styles
6. `responsive.css` - Media queries

### File Structure

```
eldir/
├── eldir.info.yml              # Theme metadata
├── eldir.libraries.yml         # Asset definitions
├── eldir.theme                 # PHP preprocessors
├── eldir.breakpoints.yml       # Responsive breakpoints
├── eldir.settings.yml          # Settings schema
├── css/
│   ├── variables.css           # Design tokens
│   ├── base.css                # Foundation styles
│   ├── layout.css              # Layout grid
│   ├── components.css          # UI components
│   ├── aegir.css               # Hosting styles
│   └── responsive.css          # Media queries
├── js/
│   └── eldir.js                # Behaviors
├── templates/
│   ├── html.html.twig
│   ├── page.html.twig
│   ├── node.html.twig
│   ├── page--user--*.html.twig # Auth pages
│   ├── hosting-*.html.twig     # Hosting entities
│   └── components/             # Reusable components
│       ├── hosting-status-badge.html.twig
│       ├── hosting-panel.html.twig
│       ├── hosting-task-card.html.twig
│       └── hosting-entity-chip.html.twig
└── images/
    └── svg/                    # Vector assets
```

## Component System

### Registering Components

**In `eldir.theme`:**
```php
function eldir_theme($existing, $type, $theme, $path) {
  return [
    'hosting_status_badge' => [
      'variables' => [
        'status' => NULL,
        'label' => NULL,
        'icon' => NULL,
        'attributes' => [],
      ],
      'template' => 'components/hosting-status-badge',
    ],
  ];
}
```

### Using Components

**Render Array:**
```php
$build['status'] = [
  '#theme' => 'hosting_status_badge',
  '#status' => 'enabled',
  '#label' => t('Active'),
];
```

**Twig Include:**
```twig
{% include '@eldir/components/hosting-status-badge.html.twig' with {
  'status': 'enabled',
  'label': 'Active'
} %}
```

### Available Components

**hosting_status_badge**
- Variables: `status`, `label`, `icon`, `attributes`
- Use: Color-coded status indicators

**hosting_panel**
- Variables: `title`, `content`, `collapsible`, `collapsed`, `actions`, `attributes`
- Use: Collapsible content sections

**hosting_task_card**
- Variables: `task_id`, `task_type`, `status`, `timestamp`, `description`, `site`, `platform`, `log`, `attributes`
- Use: Enhanced task display with expandable logs

**hosting_entity_chip**
- Variables: `entity_type`, `entity_id`, `label`, `url`, `status`, `icon`, `attributes`
- Use: Compact entity links with status

## Preprocess Functions

### Standard Preprocessors

**`eldir_preprocess_html()`**
- Adds body classes: `.aegir`, `.wide`, `.path-*`, `.ntype-*`
- Detects authentication pages
- Handles logged-in state

**`eldir_preprocess_page()`**
- Manages messages and breadcrumbs
- Builds local tasks (tabs)
- Loads menu structures
- Adds type labels to titles

**`eldir_preprocess_node()`**
- Adds node type labels
- Converts info arrays to `item_info_listing`

### Entity Preprocessors

**`eldir_preprocess_entity__hosting_*`**
- Adds data attributes for JavaScript
- Adds status classes
- Enhances entity metadata

**`eldir_add_entity_metadata_attributes()`**
Helper to add standard data attributes:
```php
$attributes['data-entity-type'] = $entity->getEntityTypeId();
$attributes['data-entity-id'] = $entity->id();
$attributes['data-view-mode'] = $view_mode;
```

## JavaScript Behaviors

All behaviors use `Drupal.behaviors` API and `once()` for proper attachment.

### Available Behaviors

**eldirSmoothScroll**
- Smooth scrolling for anchor links
- Updates URL without page jump

**eldirResponsiveTables**
- Wraps tables in scroll containers
- Adds data-label attributes for mobile

**eldirMobileNav**
- Mobile navigation toggle
- ESC key to close
- Click outside to close

**eldirFormEnhancement**
- Real-time validation feedback
- Required field indicators

**eldirAutoExpandTextarea**
- Auto-height textareas as user types

**eldirLiveTaskStatus**
- Placeholder for WebSocket integration
- Adds live update indicators

**eldirCollapsible**
- Collapsible panels via data attributes
- Keyboard accessible

**eldirActiveTrail**
- Highlights current page in navigation

**eldirCopyCode**
- Copy-to-clipboard for code blocks
- Visual feedback on copy

### Creating New Behaviors

```javascript
Drupal.behaviors.myBehavior = {
  attach: function (context, settings) {
    once('my-behavior', '.my-selector', context).forEach(function(element) {
      // Your code here
    });
  }
};
```

## Responsive Design

### Breakpoints

Defined in `eldir.breakpoints.yml`:

```yaml
eldir.mobile:
  label: Mobile
  mediaQuery: '(min-width: 0px)'
  weight: 0
  
eldir.tablet:
  label: Tablet
  mediaQuery: '(min-width: 768px)'
  weight: 1
  
eldir.desktop:
  label: Desktop
  mediaQuery: '(min-width: 1024px)'
  weight: 2
  
eldir.wide:
  label: Wide
  mediaQuery: '(min-width: 1280px)'
  weight: 3
  
eldir.ultrawide:
  label: Ultrawide
  mediaQuery: '(min-width: 1600px)'
  weight: 4
```

### Using in CSS

```css
/* Mobile first (base styles) */
.element {
  padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    padding: var(--spacing-md);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    padding: var(--spacing-lg);
  }
}
```

## CSS Class Naming

### Critical Classes (Hosting Module Dependencies)

These classes are used by hosting modules and must be preserved:

**Info Tables:**
- `.hosting-info-table` - Main table wrapper
- `.item-title` - Table row label
- `.item-value` - Table row value

**Task Items:**
- `.hosting-task-item` - Task wrapper
- `.hosting-task-status` - Status cell
- `.hosting-task-log` - Log output

**Status Indicators:**
- `.hosting-status-cell` - Status display
- `.is-available` / `.is-unavailable` - Server status
- `.hosting-status-enabled` / `.hosting-status-disabled` - Entity state

**Body Classes:**
- `.aegir` - All Aegir pages
- `.path-hosting` - Hosting module routes
- `.ntype-{type}` - Node type specific
- `.wide` - Wide layout mode

### Modern Classes (New)

**Component Classes:**
- `.hosting-status-badge` - Status indicators
- `.hosting-panel` - Content panels
- `.hosting-task-card` - Task display cards
- `.hosting-entity-chip` - Entity reference chips

**Utility Classes:**
- `.table-responsive-wrapper` - Table scroll container
- `.mobile-nav-toggle` - Mobile menu button
- `.live-indicator` - Live update indicator
- `.copy-code-button` - Copy button for code blocks

## Theme Settings API

### Accessing Settings

```php
use Drupal\Core\Extension\ThemeSettingsProvider;

$use_svg = \Drupal::service(ThemeSettingsProvider::class)->getSetting('use_svg_logo');
$wide = \Drupal::service(ThemeSettingsProvider::class)->getSetting('wide_layout');
$main_menu = \Drupal::service(ThemeSettingsProvider::class)->getSetting('main_menu_name') ?: 'main';
```

### Available Settings

- `use_svg_logo` (bool) - Prefer SVG logo
- `wide_layout` (bool) - Enable 950px layout
- `main_menu_name` (string) - Main menu machine name
- `secondary_menu_name` (string) - Secondary menu machine name

### Adding Settings

In `eldir_form_system_theme_settings_alter()`:

```php
$form['my_setting'] = [
  '#type' => 'checkbox',
  '#title' => t('My Setting'),
  '#default_value' => \Drupal::service(ThemeSettingsProvider::class)->getSetting('my_setting'),
];
```

## Template Suggestions

### Custom Suggestions

Add in preprocess functions:

```php
function eldir_preprocess_node(&$variables) {
  $node = $variables['node'];
  $variables['theme_hook_suggestions'][] = 'node__' . $node->bundle() . '__' . $variables['view_mode'];
}
```

### Existing Suggestions

- `page--user--login.html.twig` - Login page
- `page--user--register.html.twig` - Registration page
- `page--user--password.html.twig` - Password reset
- `hosting-server.html.twig` - Server entities
- `hosting-queues-table.html.twig` - Queue display

## Performance

### CSS Organization

- Variables loaded first (all files use them)
- Base styles second (foundation)
- Layout third (structure)
- Components fourth (UI elements)
- Responsive last (overrides)

### JavaScript Loading

```yaml
eldir/global:
  js:
    js/eldir.js: {}
  dependencies:
    - core/drupal
    - core/drupalSettings
    - core/once
```

### Optimization Tips

1. Use CSS variables for runtime theming
2. Minimize specificity (prefer classes over IDs)
3. Use `once()` in JavaScript behaviors
4. Leverage browser caching with aggregation
5. Minimize DOM queries in JavaScript

## Testing

### Visual Regression

1. Compare with D7 screenshots at 1280px
2. Verify responsive behavior at all breakpoints
3. Check print styles
4. Test with browser zoom (125%, 150%, 200%)

### Functionality

1. Keyboard navigation (Tab, Enter, ESC)
2. Screen reader compatibility
3. Form submission and validation
4. Task status updates
5. Table sorting and filtering

### Browser Testing

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Accessibility Testing

- WAVE browser extension
- axe DevTools
- Lighthouse accessibility audit
- Manual keyboard testing
- Screen reader testing (NVDA, JAWS, VoiceOver)

## Debugging

### Template Debugging

Enable Twig debug in `development.services.yml`:

```yaml
parameters:
  twig.config:
    debug: true
    auto_reload: true
    cache: false
```

### CSS Variables Inspection

In browser DevTools:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
```

### JavaScript Console

```javascript
// Check if behavior attached
Drupal.behaviors.eldirMobileNav.attach(document, drupalSettings);

// List all behaviors
Object.keys(Drupal.behaviors)
```

## Extending the Theme

### Creating a Subtheme

**my_eldir.info.yml:**
```yaml
name: My Eldir
type: theme
base theme: eldir
core_version_requirement: ^11
libraries:
  - my_eldir/global
```

**my_eldir.libraries.yml:**
```yaml
global:
  css:
    theme:
      css/custom.css: {}
  js:
    js/custom.js: {}
```

**Override CSS variables:**
```css
/* css/custom.css */
:root {
  --color-accent: #0066cc;
}
```

### Adding Custom Components

1. Create template in `templates/components/my-component.html.twig`
2. Register in `eldir_theme()` hook (subtheme)
3. Add CSS in subtheme stylesheet
4. Add preprocess function if needed

## API Reference

### Theme Hooks

```php
// Register custom theme
function eldir_theme($existing, $type, $theme, $path)

// Preprocess functions
function eldir_preprocess_html(&$variables)
function eldir_preprocess_page(&$variables)
function eldir_preprocess_node(&$variables)
function eldir_preprocess_entity__TYPE(&$variables)
function eldir_preprocess_HOOK(&$variables)

// Theme settings
function eldir_form_system_theme_settings_alter(&$form, $form_state)

// Helper functions
function eldir_build_menu($menu_name)
function eldir_add_entity_metadata_attributes(&$variables)
function eldir_info_table_pre_render($element)
```

### Twig Functions

Available in templates:

```twig
{# Path functions #}
{{ path('route.name') }}
{{ url('route.name') }}

{# Translation #}
{{ 'Text to translate'|t }}
{{ 'Hello @name'|t({'@name': name}) }}

{# Theme functions #}
{{ attach_library('eldir/global') }}

{# Render #}
{{ content }}
{{ content.field_name }}
{{ content|without('field_to_hide') }}

{# Filters #}
{{ text|clean_class }}
{{ date|date('Y-m-d') }}
```

## Troubleshooting

**Cache Issues**
```bash
drush cr  # Clear all caches
drush cc css-js  # Clear CSS/JS aggregation
```

**Template Not Found**
- Check file name matches theme hook
- Verify template registered in `eldir_theme()`
- Clear cache after adding templates

**CSS Not Applied**
- Verify library attached in template
- Check library definition in `.libraries.yml`
- Clear aggregation cache
- Check for CSS syntax errors

**JavaScript Not Running**
- Check browser console for errors
- Verify `once()` usage (prevents duplicate attachment)
- Check behavior is properly structured
- Ensure dependencies declared in library

## Resources

- [Drupal 11 Theming Guide](https://www.drupal.org/docs/theming-drupal)
- [Twig Documentation](https://twig.symfony.com/doc/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Aegir Hosting Module Integration

This section documents how Aegir hosting modules structure their output and what the theme needs to support.

### Hosting Module Templates

#### Core Module (`hosting`)

**hosting-queues-table.html.twig**
- Variables: `table` (render array), `queues` (array), `attributes`
- Used by: `HostingQueuesController::listing()`
- Classes: `.hosting-queues`, `.hosting-queues-table`

#### Site Module (`hosting_site`)

**hosting-site.html.twig**
- Variables: `content`, `attributes`, `label`, `title_prefix`, `title_suffix`, `title_attributes`, `entity`, `view_mode`, `sidebar`
- Classes: `.hosting-site`, `.hosting-site-content`, `.hosting-site-sidebar`
- Sidebar includes: task queue, navigation

**hosting-site-sidebar.html.twig**
- Variables: `task_queue`, `navigation`, `attributes`
- Used for: Entity view sidebar content

**hosting-site-task-queue.html.twig**
- Variables: `title`, `list`, `attributes`
- Classes: `.hosting-panel`, `.hosting-panel--task-queue`, `.hosting-task-queue`

**hosting-site-navigation.html.twig**
- Variables: `title`, `list`, `attributes`
- Classes: `.hosting-panel`, `.hosting-panel--navigation`, `.hosting-navigation`

#### Server Module (`hosting_server`)

**hosting-server.html.twig**
- Variables: `content`, `attributes`, `label`, `title_prefix`, `title_suffix`, `title_attributes`, `entity`, `view_mode`, `sidebar`
- Classes: `.hosting-server`, `.hosting-server-content`, `.hosting-server-sidebar`

**hosting-service-status-cell.html.twig**
- Variables: `text`, `available`, `service_type`, `provider_id`, `provider_label`, `attributes`
- Used for: Service availability display
- Classes: `.hosting-status-cell`, `.is-available` / `.is-unavailable`

**hosting-server-sidebar.html.twig**
- Variables: `task_queue`, `navigation`, `queue_summary`, `attributes`
- Classes: `.hosting-sidebar`

**hosting-server-task-queue.html.twig**
- Variables: `title`, `list`, `attributes`
- Classes: `.hosting-panel`, `.hosting-panel--task-queue`

**hosting-server-navigation.html.twig**
- Variables: `title`, `list`, `attributes`
- Classes: `.hosting-panel`, `.hosting-panel--navigation`

**hosting-server-queue-summary.html.twig**
- Variables: `title`, `list`, `attributes`
- Classes: `.hosting-panel`, `.hosting-queue-summary`

#### Task Module (`hosting_task`)

**hosting-task.html.twig**
- Variables: `task`, `label`, `task_type`, `status`, `command`, `args`, `options`, `started`, `completed`, `duration`, `view_mode`
- Classes: `.hosting-task`, `.hosting-task--{status}`, `.hosting-task--type-{type}`, `.hosting-task__header`, `.hosting-task__title`, `.hosting-task__meta`, `.hosting-task__type`, `.hosting-task__status`, `.hosting-task__status--{status}`, `.hosting-task__content`, `.hosting-task__section`, `.hosting-task__section--details`, `.hosting-task__section--timing`, `.hosting-task__details`, `.hosting-task__detail-item`, `.hosting-task__detail-label`, `.hosting-task__detail-value`, `.hosting-task__timing`, `.hosting-task__timing-item`, `.hosting-task__timing-label`, `.hosting-task__timing-value`
- BEM-style naming convention

### Entity Structure

#### HostingSite Entity
```php
entity_keys: id, uuid, label (domain)
fields:
  - domain (string, required)
  - client (entity_reference: hosting_client)
  - platform (entity_reference: hosting_platform, required)
  - db_server (entity_reference: hosting_server, required)
  - db_name (string)
  - profile (entity_reference: hosting_package)
  - language (string)
  - status (integer: QUEUED=0, ENABLED=1, DISABLED=-1, DELETED=-2)

view_builder: HostingSiteViewBuilder
routes:
  - canonical: /hosting/sites/{hosting_site}
  - add-form: /hosting/sites/add
  - edit-form: /hosting/sites/{hosting_site}/edit
  - delete-form: /hosting/sites/{hosting_site}/delete
  - collection: /hosting/sites
```

#### HostingServer Entity
```php
Similar structure to HostingSite
routes:
  - canonical: /hosting/servers/{hosting_server}
  - collection: /hosting/servers
```

#### HostingTask Entity
```php
entity_keys: id, uuid, label
fields:
  - label (string, required)
  - task_type (string, required)
  - status (string, required, default: 'queued')
  - context_name (string, required)
  - command (string, required)
  - args (string_long, JSON array)
  - options (string_long, JSON array)
  - started (timestamp)
  - completed (timestamp)
  - log (text_long)

Methods:
  - getTaskType(): string
  - getStatus(): string
  - getCommand(): string
  - getArgs(): array
  - getOptions(): array

routes:
  - canonical: /hosting/tasks/{hosting_task}
  - collection: /hosting/tasks
```

### Render Array Patterns

#### Task Items in Sidebar
```php
[
  '#type' => 'container',
  '#attributes' => [
    'class' => [
      'hosting-task-item',
      'hosting-task-item--{status}' // e.g., 'hosting-task-item--queued'
    ],
  ],
  'title' => [
    '#type' => 'link',
    '#title' => 'Task label',
    '#url' => Url::fromRoute('entity.hosting_task.canonical', [...]),
  ],
  'status' => [
    '#type' => 'html_tag',
    '#tag' => 'span',
    '#value' => 'queued',
    '#attributes' => ['class' => ['hosting-task-status']],
  ],
]
```

#### Panel Pattern
```php
[
  '#theme' => 'hosting_site_task_queue',
  '#title' => t('Recent tasks'),
  '#list' => [
    '#theme' => 'item_list',
    '#items' => [...],
    '#empty' => t('No tasks available.'),
    '#attributes' => ['class' => ['hosting-task-queue']],
  ],
  '#attributes' => ['class' => ['hosting-panel', 'hosting-panel--task-queue']],
]
```

#### Sidebar Assembly
```php
$build['hosting_sidebar'] = [
  '#theme' => 'hosting_site_sidebar',
  '#task_queue' => [...],
  '#navigation' => [...],
  '#attributes' => ['class' => ['hosting-sidebar']],
  '#weight' => 60,
];
```

### CSS Classes and Data Attributes

#### Generated by Hosting Modules

**Container Classes:**
- `.hosting-site-view` - Added to entire site entity build
- `.hosting-server-view` - Added to entire server entity build
- `.hosting-queues` - Queue listing container
- `.hosting-queues-table` - Queue table wrapper

**Status-Based Classes:**
- `.hosting-task-item--queued` - Task status: queued
- `.hosting-task-item--processing` - Task status: processing
- `.hosting-task-item--success` - Task status: success
- `.hosting-task-item--error` - Task status: error
- `.hosting-task--{status}` - Task entity status (BEM)
- `.hosting-task--type-{type}` - Task entity type (BEM)
- `.hosting-site--status-{status}` - Site status (added by eldir_preprocess_entity__hosting_site)

**Service Status:**
- `.hosting-status-cell` - Service status display
- `.is-available` - Service is available
- `.is-unavailable` - Service is unavailable

**Panel and List Classes:**
- `.hosting-panel` - Generic panel container
- `.hosting-panel--task-queue` - Task queue panel variant
- `.hosting-panel--navigation` - Navigation panel variant
- `.hosting-panel--queue-summary` - Queue summary panel variant
- `.hosting-task-queue` - Task list container
- `.hosting-navigation` - Navigation list container
- `.hosting-queue-summary` - Queue summary list container

**Task Detail Classes (BEM):**
- `.hosting-task__header` - Task header section
- `.hosting-task__title` - Task title
- `.hosting-task__meta` - Task metadata container
- `.hosting-task__type` - Task type badge
- `.hosting-task__status` - Task status badge
- `.hosting-task__status--{status}` - Status-specific styling
- `.hosting-task__content` - Task main content
- `.hosting-task__section` - Content section
- `.hosting-task__section--details` - Details section
- `.hosting-task__section--timing` - Timing section
- `.hosting-task__details` - Definition list for details
- `.hosting-task__detail-item` - Detail row
- `.hosting-task__detail-label` - Detail label (dt)
- `.hosting-task__detail-value` - Detail value (dd)
- `.hosting-task__timing` - Timing information list
- `.hosting-task__timing-item` - Timing row
- `.hosting-task__timing-label` - Timing label
- `.hosting-task__timing-value` - Timing value

**Data Attributes:**

Added by Eldir theme preprocessors:
```php
// Entity metadata (eldir_add_entity_metadata_attributes)
data-entity-type="hosting_site"
data-entity-id="123"
data-view-mode="full"
data-entity-bundle="hosting_site"

// Site-specific (eldir_preprocess_entity__hosting_site)
data-hosting-status="1" // STATUS_ENABLED, STATUS_DISABLED, etc.
```

### Hosting Module CSS Variables

All hosting modules use a standardized color scheme:

```css
:root {
  /* Primary colors */
  --hosting-primary: #0074bd;
  --hosting-primary-hover: #005a9c;
  
  /* Status colors */
  --hosting-success-bg: #d4edda;
  --hosting-success-text: #155724;
  --hosting-error-bg: #f8d7da;
  --hosting-error-text: #721c24;
  --hosting-warning-bg: #fff3cd;
  --hosting-warning-text: #856404;
  --hosting-info-bg: #cce5ff;
  --hosting-info-text: #004085;
  
  /* Task status colors */
  --hosting-task-queued: #ffc107;
  --hosting-task-processing: #2196f3;
  --hosting-task-success: #4caf50;
  --hosting-task-error: #f44336;
  --hosting-task-warning: #ff9800;
  
  /* UI elements */
  --hosting-border: #ddd;
  --hosting-panel-bg: #f5f5f5;
  --hosting-panel-border: #ddd;
  --hosting-text-dark: #333;
  --hosting-bg-light: #f9f9f9;
  --hosting-shadow: rgba(0, 0, 0, 0.1);
  --hosting-text-muted: #666;
}
```

**Note:** Eldir theme should coordinate these with its own color system for visual consistency.

### Form Patterns

#### Site Form (HostingSiteForm)

**Key Features:**
- Extends `ContentEntityForm`
- Domain validation and normalization via `SiteManager` service
- Auto-generates `cron_key` for new sites
- Fields: domain, client, platform, db_server, db_name, profile, language, status

**Validation:**
- Domain must be valid hostname
- Domain must be unique
- Platform must exist and be enabled

#### Standard Form Classes
All hosting forms use:
- `.hosting-form` - Form wrapper
- `.hosting-form__element` - Form element wrapper

### JavaScript Behaviors and Hooks

**Current Status:** Hosting modules do not currently provide JavaScript behaviors.

**Planned/Expected:**
- Live task status updates (WebSocket integration)
- Log viewer enhancements (filtering, syntax highlighting)
- Queue management UI interactions
- Form enhancements (conditional fields, AJAX updates)

**Theme Integration Points:**

The Eldir theme provides JavaScript hooks ready for hosting integration:

```javascript
// Live task status updates
Drupal.behaviors.eldirLiveTaskStatus
// Targets: .hosting-task-item[data-task-id]
// Adds: .status-live, .live-indicator

// Collapsible panels
Drupal.behaviors.eldirCollapsible
// Targets: .hosting-panel[data-collapsible]
// Supports: keyboard navigation, ARIA

// Copy code/logs
Drupal.behaviors.eldirCopyCode
// Targets: pre code, #hosting-task-log
// Adds: .copy-code-button
```

### View Display Modes

#### HostingSite View Modes
- **full** - Complete entity display with sidebar
- **teaser** - Summary display (if configured)
- Custom modes can be added via display configuration

#### Display Configuration
Field display options are fully configurable via:
- Admin UI: `/admin/structure/hosting_site/display`
- Config: `core.entity_view_display.hosting_site.{bundle}.{view_mode}.yml`

### Theme Suggestions

**Provided by Hosting Modules:**

```php
// Site entity
function hosting_site_theme_suggestions_hosting_site($variables) {
  $suggestions[] = 'hosting_site__' . $entity->id();
  $suggestions[] = 'hosting_site__' . $view_mode;
}

// Usage in theme:
hosting-site.html.twig          // Base
hosting-site--123.html.twig     // Specific site ID
hosting-site--full.html.twig    // View mode
```

**Available in Eldir:**
- `hosting-site.html.twig` ✓
- `hosting-server.html.twig` ✓
- `hosting-queues-table.html.twig` ✓
- `hosting-service-status-cell.html.twig` ✓

### Service Integrations

#### QueueDispatcher Service
- Service: `hosting.queue_dispatcher`
- Used by: `HostingQueuesController::listing()`
- Provides: Queue state, timing, and statistics

#### SiteManager Service
- Service: `hosting_site.manager`
- Methods: `normalizeDomain()`, `isDomainValid()`, `isDomainUnique()`, `generateCronKey()`
- Used by: `HostingSiteForm` validation and save operations

### Libraries

**hosting_site.entity_view**
```yaml
css:
  theme:
    css/hosting-site.css: {}
```

**hosting_server.entity_view**
```yaml
css:
  theme:
    css/hosting-server.css: {}
```

**hosting_task.entity_view**
```yaml
css:
  theme:
    css/hosting-task.css: {}
```

These libraries are attached automatically by the entity view builders.

### Required Theme Support

To fully support Aegir hosting modules, themes must provide:

1. **Template overrides** for:
   - `hosting-site.html.twig`
   - `hosting-server.html.twig`
   - `hosting-task.html.twig`
   - `hosting-queues-table.html.twig`
   - `hosting-service-status-cell.html.twig`

2. **CSS for hosting classes:**
   - `.hosting-panel` and variants
   - `.hosting-task-item` and status variants
   - `.hosting-status-cell` and availability states
   - `.hosting-sidebar` and `.hosting-navigation`
   - BEM classes for task display

3. **Responsive layout support:**
   - Two-column layout (content + sidebar)
   - Mobile stacking for sidebar
   - Responsive tables for queue listing

4. **Status color coordination:**
   - Align hosting module colors with theme palette
   - Ensure status badges are distinguishable
   - Maintain WCAG AA contrast

5. **JavaScript hooks (optional):**
   - Selectors for live updates
   - Panel collapsibility
   - Log viewer enhancements

### Testing Checklist for Hosting Integration

- [ ] Site entity displays with sidebar
- [ ] Server entity displays with sidebar and service status
- [ ] Task entity displays with proper BEM classes
- [ ] Queue listing table displays correctly
- [ ] Task items show correct status colors
- [ ] Service status cells indicate availability
- [ ] Panels are collapsible (if JavaScript enabled)
- [ ] Sidebar stacks below content on mobile
- [ ] All hosting routes render correctly
- [ ] Entity forms submit successfully
- [ ] Status-based classes apply correct styling
- [ ] Data attributes are present for JavaScript hooks
