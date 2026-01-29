# Aegir Eldir Theme - AI Coding Agent Instructions

**Last Updated**: January 29, 2026  
**Status**: Modernized - D11 Production Ready

## Repository Overview

**Aegir Eldir** is the official presentation layer for Aegir Hostmaster, providing a modern, responsive visual interface for all hosting management operations. This is a fully modernized Drupal 11 theme that renders hosting entities (sites, platforms, servers, tasks) with BEM-structured templates, CSS variables, and responsive design while preserving the classic D7 Aegir look and feel.

**Technology Stack**: Drupal 11, Twig, CSS3 (with variables), Modern JavaScript (Drupal.behaviors)

**Architecture**: Entity-driven rendering with custom theme hooks, comprehensive preprocess functions, BEM CSS methodology, and hosting module integration.

**Theme Philosophy**: Modern, flexible, responsive implementation that maintains D7 visual identity on desktop while adapting seamlessly to all screen sizes.

## Directory Structure

```
aegir-eldir/
├── templates/                    # Twig templates
│   ├── page.html.twig           # Page layout (responsive)
│   ├── node.html.twig           # Node display
│   ├── html.html.twig           # HTML document wrapper
│   ├── item-info-listing.html.twig  # Custom: property tables
│   ├── hosting-site.html.twig   # Site entity with sidebar support
│   ├── hosting-task.html.twig   # Task entity (BEM structure)
│   ├── hosting-server.html.twig # Server entity display
│   ├── hosting-queues-table.html.twig  # Task queue table
│   ├── hosting-service-status-cell.html.twig  # Service status
│   └── components/              # Reusable components
│       ├── hosting-panel.html.twig
│       ├── hosting-status-badge.html.twig
│       ├── hosting-task-card.html.twig
│       └── hosting-entity-chip.html.twig
├── css/                          # Modern CSS architecture
│   ├── variables.css            # CSS custom properties (NEW)
│   ├── base.css                 # Typography, reset, forms (modernized)
│   ├── layout.css               # Responsive flexbox layout
│   ├── components.css           # Tabs, menus, blocks (modernized)
│   ├── aegir.css                # Aegir-specific + BEM components
│   └── responsive.css           # Additional responsive rules
├── js/                          # Progressive enhancement
│   └── eldir.js                 # All interactive behaviors (✅ complete)
├── eldir.theme                  # Preprocess hooks, theme logic (enhanced)
├── eldir.info.yml               # Theme metadata, regions, libraries
├── eldir.libraries.yml          # CSS/JS library definitions
├── eldir.breakpoints.yml        # 5-tier responsive breakpoints
├── eldir.settings.yml           # Default theme settings
├── images/                      # SVG and raster assets
│   ├── svg/                     # SVG logos and icons
│   └── raster/                  # Background sprites
└── doc/                         # Documentation
    ├── eldir-d7.md              # D7 architecture reference
    └── eldir-d11.md             # D11 implementation guide

**Key Principle**: This theme ONLY handles presentation. All data logic resides in hosting modules.
**Design System**: CSS variables, BEM methodology, mobile-first responsive, WCAG AA compliant.
```

## Theme Architecture

### Integration Pattern

The theme consumes data from hosting entities through standard Drupal rendering:

```
Entity → View Builder → Preprocess (eldir.theme) → Twig Template → HTML
```

**Data Flow**:
1. Hosting module entity (HostingSite, HostingPlatform, etc.)
2. Entity view builder creates render array
3. Theme preprocess functions enhance variables
4. Twig template renders HTML with CSS classes
5. CSS/JS provide styling and interactivity

### Theme Configuration

**File**: [eldir.info.yml](eldir.info.yml)

```yaml
name: 'Aegir Eldir'
type: theme
description: 'Official theme for Aegir Hostmaster D11'
package: Aegir
core_version_requirement: ^11
base theme: false

regions:
  header: Header
  navigation: Navigation
  breadcrumb: Breadcrumb
  highlighted: Highlighted
  help: Help
  content: Content
  sidebar_first: 'Left sidebar'
  sidebar_second: 'Right sidebar'
  footer: Footer

libraries:
  - eldir/global

# Aegir-specific settings
settings:
  use_svg_logo: true
  wide_layout: false
  main_menu_name: main
  secondary_menu_name: account
```

### Library Definitions

**File**: [eldir.libraries.yml](eldir.libraries.yml)

```yaml
global:
  version: 1.x
  css:
    base:
      css/base.css: {}
    layout:
      css/layout.css: {}
    component:
      css/components.css: {}
    theme:
      css/aegir.css: {}

aegir-tasks:
  version: 1.x
  js:
    js/aegir-tasks.js: {}
  dependencies:
    - core/drupal
    - core/jquery
    - core/drupal.ajax

# Future: Component libraries
server-status:
  version: 1.x
  css:
    component:
      components/server-status/server-status.css: {}
  js:
    components/server-status/server-status.js: {}
```

## Custom Theme Hooks

### item_info_listing

**Purpose**: Render structured property tables for hosting entities.

**Definition** (in [eldir.theme](eldir.theme)):
```php
/**
 * Implements hook_theme().
 */
function eldir_theme($existing, $type, $theme, $path) {
  return [
    'item_info_listing' => [
      'render element' => 'info_listing',
      'template' => 'item-info-listing',
      'variables' => [
        'items' => [],
        'title' => NULL,
        'attributes' => [],
      ],
    ],
  ];
}
```

**Usage** (in hosting modules):
```php
// Entity view builder should return:
$build['info'] = [
  '#theme' => 'item_info_listing',
  '#title' => $this->t('Site Information'),
  '#items' => [
    ['title' => $this->t('Domain'), 'value' => $entity->get('domain')->value],
    ['title' => $this->t('Platform'), 'value' => $platform_link],
    ['title' => $this->t('Database'), 'value' => $entity->get('db_name')->value],
    ['title' => $this->t('Status'), 'value' => $status_badge],
  ],
  '#attributes' => ['class' => ['hosting-site-info']],
];
```

**Template** ([templates/item-info-listing.html.twig](templates/item-info-listing.html.twig)):
```twig
{#
/**
 * @file
 * Theme template for item info listing (property tables).
 *
 * Available variables:
 * - title: Optional heading for the listing
 * - items: Array of items with 'title' and 'value' keys
 * - attributes: HTML attributes for the container
 */
#}
{% if title %}
  <h3>{{ title }}</h3>
{% endif %}

<table{{ attributes.addClass('hosting-info-table') }}>
  <tbody>
    {% for item in items %}
      <tr>
        <td class="item-title">{{ item.title }}</td>
        <td class="item-value">{{ item.value }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>
```

**Current State**:
- ✅ Theme hook defined
- ✅ Basic template implemented
- ⚠️ Not consistently used by hosting modules
- ❌ No responsive mobile view
- ❌ No collapsible sections
- ❌ No icon support

**Future Goals**:
- Convert to Single Directory Component (SDC)
- Add responsive mobile layout (stacked rows)
- Implement collapsible sections
- Add icon support for titles
- Support nested listings
- Add sorting/filtering capabilities

## Preprocess Functions

### Core Preprocessing

**File**: [eldir.theme](eldir.theme)

**HTML Preprocessing**:
```php
/**
 * Implements hook_preprocess_html().
 */
function eldir_preprocess_html(&$variables) {
  // Add 'aegir' body class
  $variables['attributes']['class'][] = 'aegir';
  
  // Add path-based classes
  $path = \Drupal::service('path.current')->getPath();
  $path_alias = \Drupal::service('path_alias.manager')->getAliasByPath($path);
  $path_classes = explode('/', trim($path_alias, '/'));
  foreach ($path_classes as $class) {
    $variables['attributes']['class'][] = 'path-' . Html::cleanCssIdentifier($class);
  }
  
  // Add wide layout class if setting enabled
  if (theme_get_setting('wide_layout')) {
    $variables['attributes']['class'][] = 'wide';
  }
}
```

**Page Preprocessing**:
```php
/**
 * Implements hook_preprocess_page().
 */
function eldir_preprocess_page(&$variables) {
  // Add Aegir branding
  $variables['site_name'] = 'Aegir Hostmaster';
  $variables['site_slogan'] = 'Drupal Hosting Platform';
  
  // Enhance page title with entity type for hosting pages
  $route_match = \Drupal::routeMatch();
  if ($route_match->getRouteName() && str_starts_with($route_match->getRouteName(), 'entity.hosting_')) {
    $entity = $route_match->getParameter('hosting_site') 
           ?? $route_match->getParameter('hosting_platform')
           ?? $route_match->getParameter('hosting_server');
    
    if ($entity) {
      $type_label = $entity->getEntityType()->getLabel();
      $variables['title_prefix'] = ['#markup' => "<span class='entity-type-label'>{$type_label}:</span> "];
    }
  }
}
```

**Entity Preprocessing**:
```php
/**
 * Implements hook_preprocess_ENTITY_TYPE() for hosting entities.
 */
function eldir_preprocess_node(&$variables) {
  $node = $variables['node'];
  
  // Add entity metadata attributes
  if (str_starts_with($node->bundle(), 'hosting_')) {
    eldir_add_entity_metadata_attributes($variables);
  }
}

/**
 * Helper function to add entity metadata attributes.
 */
function eldir_add_entity_metadata_attributes(&$variables) {
  $entity = $variables['elements']['#' . $variables['elements']['#entity_type']];
  
  $variables['attributes']['data-entity-type'] = $entity->getEntityTypeId();
  $variables['attributes']['data-entity-id'] = $entity->id();
  $variables['attributes']['data-entity-bundle'] = $entity->bundle();
  $variables['attributes']['data-view-mode'] = $variables['elements']['#view_mode'];
}
```

**Form Preprocessing**:
```php
/**
 * Implements hook_preprocess_form().
 */
function eldir_preprocess_form(&$variables) {
  $form_id = $variables['element']['#form_id'] ?? '';
  
  // Add hosting form classes
  if (str_starts_with($form_id, 'hosting_')) {
    $variables['attributes']['class'][] = 'hosting-form';
    $variables['attributes']['class'][] = 'hosting-form--' . str_replace('_', '-', $form_id);
  }
}
```

**Current State**:
- ✅ Basic preprocessing for HTML, page, node, form
- ✅ Entity metadata attributes
- ⚠️ Inconsistent attribute naming
- ❌ No preprocessing for tables
- ❌ No preprocessing for views
- ❌ Missing theme suggestions

**Future Goals**:
- Add `hook_theme_suggestions_HOOK_alter()` implementations
- Preprocess tables for responsive wrapping
- Add view-specific preprocessing
- Standardize data attribute naming
- Add debug mode with visible data attributes

## Theme Suggestions

**Missing Implementation** - Should be added to [eldir.theme](eldir.theme):

```php
/**
 * Implements hook_theme_suggestions_node_alter().
 */
function eldir_theme_suggestions_node_alter(array &$suggestions, array $variables) {
  $node = $variables['elements']['#node'];
  $view_mode = $variables['elements']['#view_mode'];
  
  // Add suggestions for hosting entity node types
  if (str_starts_with($node->bundle(), 'hosting_')) {
    $sanitized_bundle = str_replace('_', '__', $node->bundle());
    $suggestions[] = 'node__' . $sanitized_bundle;
    $suggestions[] = 'node__' . $sanitized_bundle . '__' . $view_mode;
  }
}

/**
 * Implements hook_theme_suggestions_page_alter().
 */
function eldir_theme_suggestions_page_alter(array &$suggestions, array $variables) {
  $route_name = \Drupal::routeMatch()->getRouteName();
  
  // Add suggestions for hosting routes
  if ($route_name && str_starts_with($route_name, 'entity.hosting_')) {
    $route_parts = explode('.', $route_name);
    $suggestions[] = 'page__hosting';
    
    if (isset($route_parts[1])) {
      $entity_type = str_replace('_', '__', $route_parts[1]);
      $suggestions[] = 'page__' . $entity_type;
      
      if (isset($route_parts[2])) {
        $suggestions[] = 'page__' . $entity_type . '__' . $route_parts[2];
      }
    }
  }
}

/**
 * Implements hook_theme_suggestions_form_alter().
 */
function eldir_theme_suggestions_form_alter(array &$suggestions, array $variables) {
  $form_id = $variables['element']['#form_id'] ?? '';
  
  if (str_starts_with($form_id, 'hosting_')) {
    $sanitized_id = str_replace('_', '__', $form_id);
    $suggestions[] = 'form__' . $sanitized_id;
  }
}
```

**Benefits**:
- Allows templates like `node--hosting-site--full.html.twig`
- Enables page-level templates like `page--hosting-sites.html.twig`
- Supports form-specific templates like `form--hosting-site-form.html.twig`

**Future Goals**:
- Implement all suggestion hooks
- Document template hierarchy
- Create example templates for common patterns
- Add template discovery testing

## CSS Architecture

### CSS Organization

**Legacy Compatibility**: CSS preserves selectors from Drupal 7 Eldir theme for backward compatibility.

### Base Styles

**File**: [css/base.css](css/base.css)

**Responsibilities**:
- Typography (fonts, sizes, line heights)
- CSS reset/normalize
- Form controls (inputs, buttons, selects)
- Basic HTML elements

**Key Selectors**:
```css
/* Typography */
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
h1, h2, h3 { font-weight: 600; }
code, pre { font-family: 'Courier New', monospace; }

/* Forms */
input[type="text"],
input[type="email"],
select,
textarea { /* unified form styling */ }

button,
.button,
input[type="submit"] { /* button styling */ }
```

### Layout Styles

**File**: [css/layout.css](css/layout.css)

**Responsibilities**:
- Page structure (#page-wrapper, #main, #content)
- Grid system
- Responsive breakpoints
- Sidebar positioning

**Key Selectors**:
```css
/* Page structure (D7 compatible) */
#page-wrapper { max-width: 1200px; margin: 0 auto; }
#page { display: flex; flex-wrap: wrap; }
#main { flex: 1 1 100%; }
#content { padding: 20px; }

/* Sidebars */
.sidebar { width: 300px; }
#sidebar-first { order: -1; }
#sidebar-second { order: 1; }

/* Wide layout */
body.wide #page-wrapper { max-width: 100%; }

/* Responsive */
@media (max-width: 768px) {
  #main { flex-direction: column; }
  .sidebar { width: 100%; }
}
```

### Component Styles

**File**: [css/components.css](css/components.css)

**Responsibilities**:
- Navigation menus
- Tabs (local tasks)
- Blocks
- Buttons and links
- Tables
- Messages

**Key Selectors**:
```css
/* Navigation (D7 compatible) */
#navigation { background: #333; }
#main-menu { list-style: none; display: flex; }
#secondary-menu { float: right; }

/* Tabs */
.tabs { border-bottom: 1px solid #ccc; }
.tabs__tab { /* tab styling */ }
.tabs__tab.is-active { /* active tab */ }

/* Messages */
.messages { padding: 10px; border-radius: 4px; }
.messages.error { background: #fee; border-color: #f66; }
.messages.warning { background: #ffc; border-color: #fc0; }
.messages.status { background: #efe; border-color: #6c6; }

/* Tables */
table { width: 100%; border-collapse: collapse; }
th { background: #f5f5f5; font-weight: 600; }
tr:hover { background: #fafafa; }
```

### Aegir-Specific Styles

**File**: [css/aegir.css](css/aegir.css)

**Responsibilities**:
- Hosting entity displays
- Task queue interface
- Info tables
- Service status indicators
- Hosting forms

**Key Selectors**:
```css
/* Info tables (custom theme hook) */
.hosting-info-table { border: 1px solid #ddd; }
.hosting-info-table .item-title { 
  font-weight: 600; 
  width: 30%; 
  background: #f9f9f9; 
}
.hosting-info-table .item-value { padding: 8px; }

/* Task queue */
#hosting-task-log { 
  font-family: monospace; 
  background: #000; 
  color: #0f0; 
  padding: 10px; 
  max-height: 500px; 
  overflow-y: auto; 
}

.hosting-queues-table .task-status { font-weight: 600; }
.hosting-queues-table .task-status.queued { color: #666; }
.hosting-queues-table .task-status.processing { color: #06c; }
.hosting-queues-table .task-status.success { color: #0a0; }
.hosting-queues-table .task-status.failed { color: #c00; }

/* Service status */
.hosting-service-status-cell { display: flex; align-items: center; }
.hosting-service-status-cell .status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}
.hosting-service-status-cell .status-indicator.enabled { background: #0a0; }
.hosting-service-status-cell .status-indicator.disabled { background: #c00; }

/* Entity type labels (D7 compatible) */
.ntype-site { border-left: 4px solid #06c; }
.ntype-platform { border-left: 4px solid #0a0; }
.ntype-server { border-left: 4px solid #c60; }
.ntype-task { border-left: 4px solid #666; }

/* Hosting forms */
.hosting-form { max-width: 800px; }
.hosting-form .form-item { margin-bottom: 15px; }

/* Buttons */
.hosting-button-enabled,
.hosting-button-disabled {
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
}
.hosting-button-enabled { background: #0a0; color: #fff; }
.hosting-button-disabled { background: #c00; color: #fff; }
```

**Current State**:
- ✅ Complete base, layout, component, aegir stylesheets
- ✅ D7-compatible selectors for backward compatibility
- ✅ Responsive breakpoints defined
- ⚠️ No CSS custom properties (variables)
- ⚠️ No dark mode support
- ❌ Mobile optimization incomplete
- ❌ No CSS Grid usage

**Future Goals**:
- Convert to CSS custom properties for theming
- Add dark mode support
- Complete mobile responsive design
- Adopt CSS Grid for layout
- Remove D7 compatibility selectors (breaking change)
- Implement CSS linting (Stylelint)

## Responsive Design

### Breakpoint Definitions

**File**: [eldir.breakpoints.yml](eldir.breakpoints.yml)

```yaml
eldir.mobile:
  label: Mobile
  mediaQuery: 'all and (max-width: 640px)'
  weight: 0
  multipliers:
    - 1x
    - 2x

eldir.tablet:
  label: Tablet
  mediaQuery: 'all and (min-width: 641px) and (max-width: 1024px)'
  weight: 1
  multipliers:
    - 1x
    - 2x

eldir.desktop:
  label: Desktop
  mediaQuery: 'all and (min-width: 1025px)'
  weight: 2
  multipliers:
    - 1x
    - 2x
```

### Mobile Optimizations Needed

**Current State**:
- ✅ Breakpoints defined
- ⚠️ Basic responsive layout
- ❌ Tables don't collapse to cards
- ❌ Navigation not mobile-friendly
- ❌ Task logs not scrollable on mobile
- ❌ Forms not optimized for touch

**Future Goals**:

**1. Responsive Tables**:
```css
@media (max-width: 640px) {
  .hosting-info-table,
  .hosting-info-table tbody,
  .hosting-info-table tr,
  .hosting-info-table td {
    display: block;
    width: 100%;
  }
  
  .hosting-info-table .item-title {
    font-size: 12px;
    text-transform: uppercase;
    padding: 4px 8px;
  }
  
  .hosting-info-table .item-value {
    padding: 8px 8px 16px;
    border-bottom: 1px solid #eee;
  }
}
```

**2. Mobile Navigation**:
```html
<!-- Add to templates/page.html.twig -->
<button class="mobile-menu-toggle" aria-label="Toggle menu">
  <span></span>
  <span></span>
  <span></span>
</button>

<nav id="navigation" class="mobile-menu-closed">
  {{ page.navigation }}
</nav>
```

```css
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
}

@media (max-width: 640px) {
  .mobile-menu-toggle { display: block; }
  
  #navigation {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    transition: left 0.3s;
  }
  
  #navigation.mobile-menu-open {
    left: 0;
  }
}
```

**3. Touch-Friendly Forms**:
```css
@media (max-width: 640px) {
  input[type="text"],
  input[type="email"],
  select,
  textarea {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 12px;   /* Larger touch targets */
  }
  
  button,
  input[type="submit"] {
    padding: 12px 20px;
    font-size: 16px;
  }
}
```

## JavaScript Integration

**Current State**: ❌ No JavaScript files in theme

**Required Implementations**:

### Task Queue Live Updates

**File**: [js/aegir-tasks.js](js/aegir-tasks.js) (to be created)

```javascript
/**
 * @file
 * Aegir task queue live updates and log filtering.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  /**
   * Behavior for task queue live updates.
   */
  Drupal.behaviors.aegirTaskQueue = {
    attach: function (context, settings) {
      const $table = $('.hosting-queues-table', context).once('aegir-task-queue');
      
      if ($table.length === 0) {
        return;
      }
      
      // Poll task status every 10 seconds
      setInterval(function() {
        $.ajax({
          url: '/hosting/tasks/status',
          method: 'GET',
          dataType: 'json',
          success: function(data) {
            updateTaskStatuses(data);
          }
        });
      }, 10000);
      
      function updateTaskStatuses(tasks) {
        tasks.forEach(function(task) {
          const $row = $table.find('tr[data-task-id="' + task.id + '"]');
          
          if ($row.length) {
            // Update status badge
            $row.find('.task-status')
              .removeClass('queued processing success failed')
              .addClass(task.status)
              .text(task.status);
            
            // Update progress if available
            if (task.progress) {
              $row.find('.task-progress').text(task.progress + '%');
            }
          }
        });
      }
    }
  };

  /**
   * Behavior for task log auto-scroll and filtering.
   */
  Drupal.behaviors.aegirTaskLog = {
    attach: function (context, settings) {
      const $log = $('#hosting-task-log', context).once('aegir-task-log');
      
      if ($log.length === 0) {
        return;
      }
      
      // Auto-scroll to bottom
      $log.scrollTop($log[0].scrollHeight);
      
      // Log filtering
      const $filterButtons = $('<div class="task-log-filters"></div>');
      $filterButtons.append('<button data-filter="all">All</button>');
      $filterButtons.append('<button data-filter="error">Errors</button>');
      $filterButtons.append('<button data-filter="warning">Warnings</button>');
      $filterButtons.append('<button data-filter="info">Info</button>');
      
      $log.before($filterButtons);
      
      $filterButtons.on('click', 'button', function() {
        const filter = $(this).data('filter');
        const $lines = $log.find('.log-line');
        
        if (filter === 'all') {
          $lines.show();
        } else {
          $lines.hide();
          $lines.filter('[data-severity="' + filter + '"]').show();
        }
        
        $filterButtons.find('button').removeClass('active');
        $(this).addClass('active');
      });
    }
  };

  /**
   * Behavior for collapsible info tables.
   */
  Drupal.behaviors.aegirInfoTable = {
    attach: function (context, settings) {
      $('.hosting-info-table', context).once('collapsible').each(function() {
        const $table = $(this);
        const $header = $table.prev('h3');
        
        if ($header.length) {
          $header.addClass('collapsible-toggle')
            .prepend('<span class="toggle-icon">▼</span>')
            .on('click', function() {
              $table.slideToggle(200);
              $(this).find('.toggle-icon').text(
                $table.is(':visible') ? '▼' : '▶'
              );
            });
        }
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
```

**Library Registration** (add to [eldir.libraries.yml](eldir.libraries.yml)):
```yaml
aegir-tasks:
  version: 1.x
  js:
    js/aegir-tasks.js: {}
  dependencies:
    - core/drupal
    - core/jquery
    - core/drupal.ajax
    - core/once
```

**Attach to Pages** (in [eldir.theme](eldir.theme)):
```php
/**
 * Implements hook_preprocess_page().
 */
function eldir_preprocess_page(&$variables) {
  // Attach task JavaScript on hosting pages
  $route_name = \Drupal::routeMatch()->getRouteName();
  
  if ($route_name && str_starts_with($route_name, 'entity.hosting_')) {
    $variables['#attached']['library'][] = 'eldir/aegir-tasks';
  }
}
```

**Future Goals**:
- Implement all JavaScript behaviors
- Add form validation
- Create service status live indicators
- Add keyboard navigation
- Implement accessibility features (ARIA)

## Single Directory Components (SDC)

**Status**: Not implemented - future architecture decision

**Proposal**: Convert theme hooks to SDC for better encapsulation.

### Example: Info Table Component

**Directory Structure**:
```
components/
└── info-table/
    ├── info-table.component.yml    # Component metadata
    ├── info-table.twig              # Template
    ├── info-table.css               # Component-specific styles
    └── info-table.js                # Component-specific JS
```

**Component Definition** (`info-table.component.yml`):
```yaml
'$schema': https://git.drupalcode.org/project/drupal/-/raw/11.x/core/modules/sdc/src/ComponentSchema.json
name: Info Table
description: 'Displays structured property listings for Aegir entities'
props:
  type: object
  properties:
    title:
      type: string
      title: Table Title
    items:
      type: array
      title: Table Items
      items:
        type: object
        properties:
          title:
            type: string
          value:
            type: string
    collapsible:
      type: boolean
      title: Collapsible
      default: false
libraryOverrides:
  css:
    component:
      css/components.css: false
```

**Component Template** (`info-table.twig`):
```twig
<div class="info-table-wrapper" {{ attributes }}>
  {% if title %}
    <h3 class="info-table-title{% if collapsible %} collapsible-toggle{% endif %}">
      {% if collapsible %}<span class="toggle-icon">▼</span>{% endif %}
      {{ title }}
    </h3>
  {% endif %}
  
  <table class="info-table">
    <tbody>
      {% for item in items %}
        <tr>
          <td class="info-table__title">{{ item.title }}</td>
          <td class="info-table__value">{{ item.value }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

**Usage**:
```php
$build['info'] = [
  '#type' => 'component',
  '#component' => 'eldir:info-table',
  '#props' => [
    'title' => 'Site Information',
    'items' => [...],
    'collapsible' => TRUE,
  ],
];
```

**Future Goals**:
- Convert `item_info_listing` to SDC
- Create `server-status` component
- Create `task-log` component
- Create `service-badge` component
- Document component usage patterns

## Theme Settings

**File**: [eldir.theme](eldir.theme)

**Settings Form**:
```php
/**
 * Implements hook_form_system_theme_settings_alter().
 */
function eldir_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {
  $form['aegir_settings'] = [
    '#type' => 'details',
    '#title' => t('Aegir Settings'),
    '#open' => TRUE,
  ];
  
  $form['aegir_settings']['use_svg_logo'] = [
    '#type' => 'checkbox',
    '#title' => t('Use SVG logo'),
    '#description' => t('Use SVG logo instead of PNG for better quality.'),
    '#default_value' => theme_get_setting('use_svg_logo'),
  ];
  
  $form['aegir_settings']['wide_layout'] = [
    '#type' => 'checkbox',
    '#title' => t('Wide layout'),
    '#description' => t('Remove maximum width constraint for wide displays.'),
    '#default_value' => theme_get_setting('wide_layout'),
  ];
  
  $form['aegir_settings']['main_menu_name'] = [
    '#type' => 'select',
    '#title' => t('Main menu'),
    '#options' => menu_ui_get_menus(),
    '#default_value' => theme_get_setting('main_menu_name') ?: 'main',
  ];
  
  $form['aegir_settings']['secondary_menu_name'] = [
    '#type' => 'select',
    '#title' => t('Secondary menu'),
    '#options' => menu_ui_get_menus(),
    '#default_value' => theme_get_setting('secondary_menu_name') ?: 'account',
  ];
}
```

**Current State**:
- ✅ Settings form defined
- ⚠️ `use_svg_logo` not implemented in templates
- ✅ `wide_layout` working
- ⚠️ Menu name settings not used

**Future Goals**:
- Implement SVG logo switching
- Use menu name settings in templates
- Add color scheme settings
- Add font selection options
- Add layout density settings

## Module Integration Checklist

**When hosting modules render entities, ensure**:

- ✅ Entity view builders use `#theme => 'item_info_listing'` for property displays
- ✅ Forms include proper `#form_id` for theme preprocessing
- ✅ Routes follow `entity.hosting_*` naming convention
- ✅ CSS classes follow `.hosting-*` naming pattern
- ✅ Templates use consistent data attributes (`data-entity-type`, `data-entity-id`)
- ✅ JavaScript behaviors registered with `Drupal.behaviors`
- ✅ Responsive considerations for mobile/tablet views
- ✅ Accessibility (ARIA labels, keyboard navigation)

## Anti-Patterns

### ❌ Don't hardcode HTML in modules
```php
// WRONG: Bypass theme system
$build['info'] = [
  '#markup' => '<table class="hosting-info-table">...</table>',
];

// CORRECT: Use theme hook
$build['info'] = [
  '#theme' => 'item_info_listing',
  '#items' => [...],
];
```

### ❌ Don't skip preprocess functions
```twig
{# WRONG: Hardcode classes in template #}
<div class="hosting-site-entity">

{# CORRECT: Use preprocess-added attributes #}
<div{{ attributes }}>
```

### ❌ Don't inline styles
```twig
{# WRONG: Inline styles #}
<div style="color: red;">

{# CORRECT: Use CSS classes #}
<div class="status-error">
```

### ❌ Don't bypass Drupal.behaviors
```javascript
// WRONG: Direct jQuery on page load
$(document).ready(function() {
  $('.hosting-task').click(...);
});

// CORRECT: Use Drupal behaviors
Drupal.behaviors.aegirTask = {
  attach: function(context, settings) {
    $('.hosting-task', context).once('aegir-task').click(...);
  }
};
```

## Development Workflow

### Testing Checklist

When making theme changes:

1. **Clear caches**: `drush cache:rebuild`
2. **Test entity displays**: View site, platform, server, task entities in full and teaser modes
3. **Verify theme hooks**: `drush theme:debug` to see which templates are used
4. **Check CSS selectors**: Inspect HTML to ensure `.hosting-*` classes are present
5. **Test responsive**: Use browser dev tools to test mobile/tablet breakpoints
6. **Validate accessibility**: Check ARIA labels, keyboard navigation
7. **Test JavaScript**: Verify behaviors attach and work correctly

### Debug Mode

**Add to [eldir.theme](eldir.theme)**:
```php
/**
 * Implements hook_preprocess_html().
 */
function eldir_preprocess_html(&$variables) {
  // Enable debug mode via setting or query parameter
  $debug = theme_get_setting('debug_mode') || \Drupal::request()->query->get('theme_debug');
  
  if ($debug) {
    $variables['attributes']['data-theme-debug'] = 'true';
    $variables['#attached']['library'][] = 'eldir/debug';
  }
}
```

## Technology Requirements

**Drupal**: 11.x

**Browser Support**:
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 15+, Chrome Mobile latest

**CSS Features**:
- Flexbox (required)
- CSS Grid (future goal)
- CSS Custom Properties (future goal)
- Media Queries (required)

**JavaScript**:
- ES6+ syntax
- Drupal.behaviors pattern
- jQuery (via Drupal core)
- AJAX API (via Drupal core)

## Future Development Goals

### High Priority

1. **Complete JavaScript Implementation**
   - Task queue live updates
   - Task log filtering and auto-scroll
   - Collapsible info tables
   - Mobile menu toggle

2. **Mobile Optimization**
   - Responsive tables (collapse to cards)
   - Touch-friendly forms
   - Mobile navigation menu
   - Optimized task log for mobile

3. **Theme Suggestions**
   - Implement all `hook_theme_suggestions_HOOK_alter()`
   - Create example templates
   - Document template hierarchy

4. **Accessibility**
   - ARIA labels for interactive elements
   - Keyboard navigation
   - Screen reader testing
   - WCAG 2.1 AA compliance

### Medium Priority

5. **Single Directory Components (SDC)**
   - Convert `item_info_listing` to SDC
   - Create reusable components
   - Document component API

6. **CSS Modernization**
   - Convert to CSS custom properties
   - Add dark mode support
   - Adopt CSS Grid for layout
   - Remove D7 compatibility (breaking change)

7. **Settings Enhancement**
   - Implement SVG logo switching
   - Add color scheme options
   - Add font selection
   - Add layout density settings

8. **Performance**
   - Lazy load JavaScript
   - Optimize CSS delivery
   - Add critical CSS
   - Minimize render-blocking resources

### Low Priority

9. **Advanced Features**
   - Real-time service status indicators
   - Drag-and-drop task reordering
   - Bulk task operations
   - Advanced filtering/search

10. **Documentation**
    - Component library/style guide
    - Template usage examples
    - CSS architecture guide
    - JavaScript patterns guide

## Key Files Reference

- [eldir.theme](eldir.theme) - Preprocess hooks, theme logic (417 lines)
- [eldir.info.yml](eldir.info.yml) - Theme metadata, regions, libraries
- [eldir.libraries.yml](eldir.libraries.yml) - CSS/JS library definitions
- [eldir.breakpoints.yml](eldir.breakpoints.yml) - Responsive breakpoints
- [templates/item-info-listing.html.twig](templates/item-info-listing.html.twig) - Custom theme hook
- [css/base.css](css/base.css) - Typography, reset, forms
- [css/layout.css](css/layout.css) - Page structure, grid
- [css/components.css](css/components.css) - UI components
- [css/aegir.css](css/aegir.css) - Aegir-specific styles
