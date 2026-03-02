Add a new JavaScript behavior to `js/eldir.js` in the aegir-eldir theme.

Read `js/eldir.js` first to understand existing behaviors before adding a new one.

## Standard Behavior Template

Add inside `js/eldir.js`:

```javascript
Drupal.behaviors.eldir{BehaviorName} = {
  attach(context, settings) {
    once('eldir-{behavior-name}', '.{css-selector}', context).forEach((el) => {
      // Setup: event listeners, DOM manipulation, etc.
      el.addEventListener('click', (e) => {
        // Handler logic
      });
    });
  },
  detach(context, settings, trigger) {
    // Cleanup if you added timers/intervals/external listeners
    // Only implement if needed
  },
};
```

## Key Rules

- **Always use `once()`** — prevents re-attaching on AJAX partial reloads
- **Use `context` parameter** (not `document`) — scopes to newly added DOM
- **Implement `detach()`** if you add `setInterval`, `setTimeout`, or external event listeners
- **Use `Drupal.t()`** for user-visible strings (translation)
- **Use `drupalSettings`** for server-side data passed to JS
- **Use `data-*` attributes** as JS hooks, not CSS classes
- **No jQuery** — use vanilla ES6+ APIs

## Polling / AJAX Behavior Template

For behaviors that poll a server endpoint:

```javascript
Drupal.behaviors.eldir{Name} = {
  attach(context, settings) {
    once('eldir-{name}', '[data-{entity}-id]', context).forEach((el) => {
      const entityId = el.dataset.{entity}Id;
      const interval = setInterval(() => {
        fetch(`/path/${entityId}/status`)
          .then(r => r.json())
          .then(data => {
            el.textContent = data.status;
            if (['success', 'error'].includes(data.status)) {
              clearInterval(interval);
            }
          });
      }, 5000);

      // Store for cleanup
      el._eldirInterval = interval;
    });
  },
  detach(context, settings, trigger) {
    if (trigger === 'unload') {
      context.querySelectorAll?.('[data-{entity}-id]')?.forEach((el) => {
        if (el._eldirInterval) clearInterval(el._eldirInterval);
      });
    }
  },
};
```

## Existing Behaviors (do not duplicate)

| Behavior | Selector | Purpose |
|----------|----------|---------|
| `eldirSmoothScroll` | Anchor links | Smooth scroll |
| `eldirResponsiveTables` | `table` | Mobile scroll wrapper |
| `eldirMobileNav` | Navigation | Mobile menu toggle |
| `eldirFormEnhancement` | Forms | Enhanced form UX |
| `eldirAutoExpandTextarea` | `textarea` | Auto-grow height |
| `eldirLiveTaskStatus` | Task elements | Poll task status |
| `eldirCollapsible` | Panels | Collapse/expand |
| `eldirActiveTrail` | Menu items | Active trail |
| `eldirCopyCode` | Code blocks | Copy to clipboard |

## After Changes

```bash
drush cr
```

Verify in browser console:
```javascript
Object.keys(Drupal.behaviors).filter(b => b.startsWith('eldir'));
```
