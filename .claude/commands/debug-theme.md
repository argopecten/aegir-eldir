Diagnose and fix a theme issue in aegir-eldir. Work through these steps systematically before changing code.

## Step 1: Enable Twig Debug

In `web/sites/default/services.yml` (or `development.services.yml`):

```yaml
parameters:
  twig.config:
    debug: true
    auto_reload: true
    cache: false
```

Then:
```bash
drush cr
```

HTML comments will now show which template is active:
```html
<!-- THEME DEBUG -->
<!-- THEME HOOK: 'page' -->
<!-- FILE NAME SUGGESTIONS:
   * page--hosting.html.twig   ← would use this
   * page.html.twig            ← falls back to this
-->
<!-- BEGIN OUTPUT from 'themes/contrib/aegir-eldir/templates/page--hosting.html.twig' -->
```

## Step 2: Check Template Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Template not used | Wrong filename (underscores/hyphens) | `hosting_server` → `hosting-server.html.twig` |
| Wrong template selected | Suggestion priority order | Check position in `$suggestions[]` array |
| Variable undefined | Missing preprocess function | Add `eldir_preprocess_{hook}()` to `eldir.theme` |
| Twig error | Variable not available | Use `{{ dump(variable) }}` in template temporarily |

## Step 3: Check CSS Loading

```bash
drush cr
```

If styles still don't appear:
- Check `eldir.libraries.yml` includes the file
- Check file path is correct
- Hard-refresh browser (Ctrl+Shift+R)

## Step 4: Check JS Behavior Attachment

In browser console:
```javascript
// List all attached eldir behaviors
Object.keys(Drupal.behaviors).filter(b => b.startsWith('eldir'));

// Manually trigger an attach (useful for AJAX pages)
Drupal.behaviors.eldir{BehaviorName}.attach(document, drupalSettings);
```

Common JS issues:
| Problem | Cause | Fix |
|---------|-------|-----|
| Behavior not attaching | Missing `once()` or duplicate attach | Verify `once('key', selector, context)` |
| Behavior fires on wrong elements | Using `document` instead of `context` | Replace `document.querySelectorAll` with `context.querySelectorAll` |
| Behavior not re-attaching after AJAX | `once()` key mismatch | Verify same key used consistently |
| Interval not cleared | Missing `detach()` | Add `detach()` with `clearInterval` |

## Step 5: Inspect Preprocess Variables

Add temporarily to the preprocess function:
```php
dump(array_keys($variables));  // See what's available
```

Or from Twig:
```twig
{{ dump(variables_name) }}
```

## Step 6: Task Queue / Backend (if theme displays task data)

```bash
drush queue:list
drush sql:query "SELECT * FROM hosting_task_log WHERE task__target_id=123 ORDER BY timestamp"
drush cr
```

## Common Theme-Specific Failures

| Symptom | Likely Cause |
|---------|-------------|
| Status badge not shown | Missing `status_badge` variable in preprocess |
| Sidebar missing | Route not matching `hosting.*` pattern; check `eldir_theme_suggestions_page_alter()` |
| Collapsible panel not working | `once()` key conflict or wrong selector in `eldirCollapsible` |
| Entity chip link broken | `url` variable not set in preprocess |
| No `hosting-platform.html.twig` | Known issue — template does not exist; create it if needed |

Diagnose the specific issue described by the user using the steps above, then fix the root cause.
