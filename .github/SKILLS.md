# AI Skills — aegir-eldir (Theme)

> Actionable instruction sets for performing specialized tasks in the Eldir theme.
> Each skill is a step-by-step procedure an AI agent can follow to completion.

---

## Skill 1: Create an Entity Display Template

**When**: You need a custom template for a hosting entity type (e.g., `hosting-platform.html.twig`).

### Steps

1. **Create template** at `templates/hosting-{entity_type}.html.twig`:
   ```twig
   {#
   /**
    * @file
    * Template for hosting {entity_type} entities.
    *
    * Available variables:
    * - content: Entity render array.
    * - attributes: HTML attributes for the wrapper.
    * - {entity_type}: The entity object.
    */
   #}
   <article{{ attributes.addClass('hosting-{entity_type}') }}>

     <header class="hosting-{entity_type}__header">
       <h2 class="hosting-{entity_type}__title">{{ label }}</h2>
       {% if status_badge %}
         {{ status_badge }}
       {% endif %}
     </header>

     <div class="hosting-{entity_type}__content">
       {{ content }}
     </div>

     {% if sidebar %}
       <aside class="hosting-{entity_type}__sidebar">
         {{ sidebar }}
       </aside>
     {% endif %}

   </article>
   ```

2. **Add preprocess function** in `eldir.theme`:
   ```php
   function eldir_preprocess_hosting_{entity_type}(array &$variables): void {
       $entity = $variables['elements']['#hosting_{entity_type}'];

       $variables['label'] = $entity->label();
       $variables['status'] = $entity->get('status')->value ?? 'unknown';

       // Add status badge component
       $variables['status_badge'] = [
           '#theme' => 'hosting_status_badge',
           '#status' => $variables['status'],
           '#label' => ucfirst($variables['status']),
       ];

       // Add entity metadata attributes for JS
       eldir_add_entity_metadata_attributes($variables);
   }
   ```

3. **Add CSS** in `css/aegir.css` using BEM:
   ```css
   .hosting-{entity_type} {
       display: grid;
       gap: var(--aegir-spacing-md);
   }

   .hosting-{entity_type}__header {
       display: flex;
       align-items: center;
       gap: var(--aegir-spacing-sm);
   }

   .hosting-{entity_type}__title {
       font-size: var(--aegir-font-size-lg);
       font-weight: var(--aegir-font-weight-bold);
   }
   ```

4. **Clear cache**: `drush cr`

### Template Naming Convention

Drupal automatically maps entity templates:
- Entity type `hosting_server` → `hosting-server.html.twig`
- Entity type `hosting_platform` → `hosting-platform.html.twig`
- Underscores become hyphens in template filenames

---

## Skill 2: Create a Custom Theme Hook Component

**When**: You need a reusable UI component (badge, card, chip, panel).

### Steps

1. **Register the hook** in `eldir_theme()` in `eldir.theme`:
   ```php
   '{component_name}' => [
       'variables' => [
           'var1' => NULL,
           'var2' => NULL,
           'attributes' => [],
       ],
       'template' => 'components/{component-name}',
   ],
   ```

2. **Create template** at `templates/components/{component-name}.html.twig`:
   ```twig
   {#
   /**
    * @file
    * Template for {component_name} component.
    *
    * Variables:
    * - var1: Description.
    * - var2: Description.
    * - attributes: HTML attributes.
    */
   #}
   <div{{ attributes.addClass('{component-name}') }}>
     <span class="{component-name}__var1">{{ var1 }}</span>
     {% if var2 %}
       <span class="{component-name}__var2">{{ var2 }}</span>
     {% endif %}
   </div>
   ```

3. **Add preprocess** in `eldir.theme`:
   ```php
   function eldir_preprocess_{component_name}(array &$variables): void {
       // Add computed classes, format data, etc.
   }
   ```

4. **Add CSS** in `css/components.css`:
   ```css
   .{component-name} {
       display: inline-flex;
       align-items: center;
       gap: var(--aegir-spacing-xs);
   }
   ```

5. **Use the component** from any template or render array:
   ```twig
   {{ theme('component_name', { var1: 'value', var2: 'value' }) }}
   ```
   Or from PHP:
   ```php
   $build['component'] = [
       '#theme' => 'component_name',
       '#var1' => 'value',
       '#var2' => 'value',
   ];
   ```

### Existing Components

| Hook | Template | Purpose |
|------|----------|---------|
| `hosting_status_badge` | `components/hosting-status-badge` | Status indicator with color/icon |
| `hosting_panel` | `components/hosting-panel` | Collapsible content panel |
| `hosting_task_card` | `components/hosting-task-card` | Task summary card |
| `hosting_entity_chip` | `components/hosting-entity-chip` | Inline entity reference chip |

---

## Skill 3: Add CSS Styles

**When**: You need to add or modify styles for a new or existing component.

### Steps

1. **Identify the correct CSS file**:

   | File | When to Use |
   |------|-------------|
   | `variables.css` | New custom properties (colors, spacing, fonts) |
   | `base.css` | HTML element resets, typography |
   | `layout.css` | Page grid, sidebar layout, region positioning |
   | `components.css` | Reusable component styles (BEM blocks) |
   | `aegir.css` | Hosting-specific entity/page styles |
   | `responsive.css` | Media query overrides |

2. **Use CSS custom properties** — never hardcode colors, spacing, or fonts:
   ```css
   /* ✅ Correct */
   .hosting-server__header {
       color: var(--aegir-color-text);
       padding: var(--aegir-spacing-md);
       border-radius: var(--aegir-radius-sm);
   }

   /* ❌ Wrong — hardcoded values */
   .hosting-server__header {
       color: #333;
       padding: 16px;
       border-radius: 4px;
   }
   ```

3. **Follow BEM naming**:
   ```css
   /* Block */
   .hosting-task-card { }

   /* Element (part of block) */
   .hosting-task-card__header { }
   .hosting-task-card__status { }
   .hosting-task-card__body { }

   /* Modifier (variation of block or element) */
   .hosting-task-card--error { }
   .hosting-task-card__status--success { }
   ```

4. **Add responsive overrides** in `responsive.css`:
   ```css
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

5. **For new custom properties**, add to `variables.css`:
   ```css
   :root {
       --aegir-new-property: value;
   }
   ```

### Breakpoint Reference

| Breakpoint | Media Query | Use Case |
|-----------|-------------|----------|
| Mobile | `min-width: 0` | Base styles (no query needed) |
| Tablet | `min-width: 768px` | Two-column layouts |
| Desktop | `min-width: 1024px` | Sidebar visible, full layout |
| Wide | `min-width: 1280px` | Extra spacing, larger fonts |
| Ultra-wide | `min-width: 1600px` | Maximum content width |

---

## Skill 4: Add a JavaScript Behavior

**When**: You need client-side interactivity (polling, toggle, form enhancement).

### Steps

1. **Add behavior** to `js/eldir.js`:
   ```javascript
   Drupal.behaviors.eldir{BehaviorName} = {
       attach(context, settings) {
           once('eldir-{behavior-name}', '.{selector}', context).forEach((el) => {
               // Setup: event listeners, DOM manipulation, etc.
               el.addEventListener('click', (e) => {
                   // Handler logic
               });
           });
       },
       detach(context, settings, trigger) {
           // Cleanup if needed (remove event listeners on AJAX replacement)
       },
   };
   ```

2. **Key rules**:
   - Always use `once()` — prevents re-attaching on AJAX partial reloads
   - Use `context` parameter (not `document`) — scopes to newly added DOM
   - Implement `detach()` if you add timers, intervals, or external listeners
   - Use Drupal API: `Drupal.t()` for translations, `drupalSettings` for server data

3. **For AJAX/polling behaviors** (like task status):
   ```javascript
   Drupal.behaviors.eldirLiveStatus = {
       attach(context, settings) {
           once('eldir-live-status', '[data-task-id]', context).forEach((el) => {
               const taskId = el.dataset.taskId;
               const interval = setInterval(() => {
                   fetch(`/hosting_task/${taskId}/status`)
                       .then(r => r.json())
                       .then(data => {
                           el.textContent = data.status;
                           if (['success', 'error'].includes(data.status)) {
                               clearInterval(interval);
                           }
                       });
               }, 5000);

               // Store interval for cleanup
               el._statusInterval = interval;
           });
       },
       detach(context, settings, trigger) {
           if (trigger === 'unload') {
               context.querySelectorAll?.('[data-task-id]')?.forEach((el) => {
                   if (el._statusInterval) clearInterval(el._statusInterval);
               });
           }
       },
   };
   ```

### Existing Behaviors Reference

| Behavior | Selector | What it Does |
|----------|----------|-------------|
| `eldirSmoothScroll` | Anchor links | Smooth scroll animation |
| `eldirResponsiveTables` | `table` | Wraps tables for mobile scroll |
| `eldirMobileNav` | Navigation | Toggle mobile menu |
| `eldirFormEnhancement` | Forms | Enhanced form UX |
| `eldirAutoExpandTextarea` | `textarea` | Auto-grow height |
| `eldirLiveTaskStatus` | Task elements | Poll task status |
| `eldirCollapsible` | Panels | Collapse/expand panels |
| `eldirActiveTrail` | Menu items | Highlight active trail |
| `eldirCopyCode` | Code blocks | Copy to clipboard |

---

## Skill 5: Add a Page Template Suggestion

**When**: You need a specific layout for certain routes or conditions.

### Steps

1. **Add suggestion** in `eldir_theme_suggestions_page_alter()`:
   ```php
   function eldir_theme_suggestions_page_alter(array &$suggestions, array $variables) {
       $route_name = \Drupal::routeMatch()->getRouteName();

       // Add suggestion for your route pattern
       if ($route_name && str_starts_with($route_name, 'hosting_{module}.')) {
           $suggestions[] = 'page__{module}_section';
       }
   }
   ```

2. **Create template** at `templates/page--{module}-section.html.twig`:
   ```twig
   {# Based on page.html.twig but with custom layout #}
   ```

3. **Existing suggestion logic**:
   - `hosting.*` routes → `page--hosting.html.twig` (has sidebar)
   - `entity.hosting_*.canonical` routes → default `page.html.twig` (entity renders its own sidebar)
   - `user.login` → `page--user--login.html.twig`
   - `user.pass` → `page--user--password.html.twig`
   - `user.register` → `page--user--register.html.twig`

---

## Skill 6: Add a Preprocess Function

**When**: You need to prepare variables for a template before rendering.

### Steps

1. **Identify the hook name** — it matches the template:
   - `page.html.twig` → `eldir_preprocess_page()`
   - `hosting-server.html.twig` → `eldir_preprocess_hosting_server()`
   - `components/hosting-panel.html.twig` → `eldir_preprocess_hosting_panel()`
   - Entity view mode → `eldir_preprocess_entity__hosting_{type}()`

2. **Add function** to `eldir.theme`:
   ```php
   /**
    * Implements hook_preprocess_{HOOK}().
    */
   function eldir_preprocess_{hook}(array &$variables): void {
       // Access entity data
       $entity = $variables['elements']['#hosting_{type}'] ?? NULL;

       if ($entity) {
           // Add computed variables
           $variables['status_class'] = 'hosting--' . ($entity->get('status')->value ?? 'unknown');

           // Add status badge component
           $variables['status_badge'] = [
               '#theme' => 'hosting_status_badge',
               '#status' => $entity->get('status')->value,
               '#label' => ucfirst($entity->get('status')->value ?? ''),
           ];
       }

       // Add metadata attributes for JS behaviors
       eldir_add_entity_metadata_attributes($variables);
   }
   ```

3. **Rules for preprocess functions**:
   - ✅ Format dates, add CSS classes, compute display values
   - ✅ Build render arrays for component theme hooks
   - ✅ Read entity field values for template variables
   - ❌ No business logic, no entity saves, no API calls
   - ❌ No database queries (use what's in the render array)

---

## Skill 7: Modify the Sidebar Layout

**When**: You need to change how/when the sidebar appears.

### How the Sidebar Works

1. **Hosting routes** (`hosting.*`, `entity.hosting_*`) use `page--hosting.html.twig` which renders `sidebar_first` and `sidebar_second` regions
2. **Entity canonical pages** use default `page.html.twig` — entities render their own sidebar via ViewBuilder
3. The `HostingSidebarBuilder` service (in aegir-hosting) builds sidebar content
4. Layout is CSS Grid in `layout.css` — sidebar appears at `min-width: 1024px`

### Modifying Sidebar Layout

1. **To change grid layout**, edit `css/layout.css`:
   ```css
   @media (min-width: 1024px) {
       .page-wrapper {
           display: grid;
           grid-template-columns: 1fr 300px; /* main + sidebar */
           gap: var(--aegir-spacing-lg);
       }
   }
   ```

2. **To add sidebar content**, modify the hosting module's `HostingSidebarBuilder` (NOT the theme).

3. **To change sidebar appearance**, modify `css/aegir.css` or `css/components.css`.

---

## Skill 8: Debug Theme Issues

**When**: Templates aren't rendering, styles aren't applying, or JS behaviors aren't attaching.

### Diagnostic Steps

1. **Enable Twig debugging**:
   ```bash
   # In web/sites/default/services.yml or web/sites/development.services.yml
   parameters:
     twig.config:
       debug: true
       auto_reload: true
       cache: false
   ```
   Then `drush cr` — HTML comments show which template is used.

2. **Check template suggestions** — with Twig debug on, HTML comments show:
   ```html
   <!-- THEME DEBUG -->
   <!-- THEME HOOK: 'page' -->
   <!-- FILE NAME SUGGESTIONS:
      * page--hosting.html.twig
      * page.html.twig
   -->
   <!-- BEGIN OUTPUT from 'themes/contrib/aegir-eldir/templates/page--hosting.html.twig' -->
   ```

3. **Check preprocess variables** — add to preprocess:
   ```php
   dump(array_keys($variables)); // See available variables
   ```

4. **Check CSS loading** — verify `eldir.libraries.yml` includes the file and `drush cr`.

5. **Check JS behavior attachment** — in browser console:
   ```javascript
   Object.keys(Drupal.behaviors).filter(b => b.startsWith('eldir'));
   ```

6. **Common issues**:
   | Problem | Cause | Fix |
   |---------|-------|-----|
   | Template not used | Wrong filename | Check hyphens vs underscores, verify suggestion |
   | Styles not loading | Cache | `drush cr` |
   | JS not attaching | Missing `once()` or wrong selector | Check `context` scoping |
   | Variable undefined | Missing preprocess | Add preprocess function |
   | Wrong template | Suggestion priority | Check weight/position in suggestions array |

---

## Coding Standards

- **CSS**: BEM naming, CSS custom properties only, mobile-first responsive
- **JS**: ES6+, `Drupal.behaviors.*` pattern, `once()` required, no jQuery
- **Twig**: Meaningful indentation, comment variables at top, use `attributes` object
- **PHP** (eldir.theme): `declare(strict_types=1)` not applicable in .theme file, but use type hints in function signatures
- **Accessibility**: WCAG AA — semantic HTML, ARIA labels, keyboard navigation, color contrast
- **No PHP classes** — all PHP goes in `eldir.theme` only
- **SDC planned** — currently uses traditional templates + hooks; new components should use SDC format per [doc/TODO.md](../doc/TODO.md)
