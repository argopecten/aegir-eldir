Create or update an aegir-eldir Twig template or reusable component.

Ask the user which type they need:
1. **Entity display template** — for a hosting entity type (e.g., `hosting-platform`)
2. **Reusable component** — a new theme hook (badge, card, chip, panel)
3. **Page template suggestion** — layout for specific routes

Then follow the matching steps below.

---

## Option A: Entity Display Template

### 1. Create template at `templates/hosting-{entity_type}.html.twig`

```twig
{#
/**
 * @file
 * Template for hosting {entity_type} entities.
 *
 * Available variables:
 * - content: Entity render array.
 * - attributes: HTML attributes for the wrapper.
 * - label: Entity label.
 * - status_badge: Status badge render array (hosting_status_badge hook).
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

</article>
```

### 2. Add preprocess in `eldir.theme`

```php
/**
 * Implements hook_preprocess_hosting_{entity_type}().
 */
function eldir_preprocess_hosting_{entity_type}(array &$variables): void {
    $entity = $variables['elements']['#hosting_{entity_type}'];

    $variables['label'] = $entity->label();
    $variables['status'] = $entity->get('status')->value ?? 'unknown';

    $variables['status_badge'] = [
        '#theme' => 'hosting_status_badge',
        '#status' => $variables['status'],
        '#label' => ucfirst($variables['status']),
    ];

    eldir_add_entity_metadata_attributes($variables);
}
```

### 3. Add CSS in `css/aegir.css`

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

---

## Option B: Reusable Component Theme Hook

### 1. Register in `eldir_theme()` in `eldir.theme`

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

### 2. Create `templates/components/{component-name}.html.twig`

```twig
{#
/**
 * @file
 * {Component} component.
 *
 * Variables:
 * - var1: Description.
 * - var2: Description.
 * - attributes: HTML attributes.
 */
#}
<div{{ attributes.addClass('{component-name}') }}>
  <span class="{component-name}__label">{{ var1 }}</span>
  {% if var2 %}
    <span class="{component-name}__secondary">{{ var2 }}</span>
  {% endif %}
</div>
```

### 3. Add preprocess in `eldir.theme`

```php
function eldir_preprocess_{component_name}(array &$variables): void {
    // Add computed classes, format data, etc.
}
```

### 4. Add CSS in `css/components.css`

```css
.{component-name} {
    display: inline-flex;
    align-items: center;
    gap: var(--aegir-spacing-xs);
}
```

---

## Option C: Page Template Suggestion

### 1. Add suggestion in `eldir_theme_suggestions_page_alter()` in `eldir.theme`

```php
if ($route_name && str_starts_with($route_name, 'hosting_{module}.')) {
    $suggestions[] = 'page__{module}_section';
}
```

### 2. Create `templates/page--{module}-section.html.twig` based on `page.html.twig`

---

## After Changes

```bash
drush cr
```

## Rules

- Template filenames: underscores → hyphens (`hosting_server` → `hosting-server.html.twig`)
- CSS: BEM naming, CSS custom properties only — no hardcoded values
- Preprocess: formatting only — no business logic, no entity saves, no DB queries
- Base theme is `false` — Eldir is standalone
- Read existing templates (e.g., `hosting-server.html.twig`) before implementing to match style
