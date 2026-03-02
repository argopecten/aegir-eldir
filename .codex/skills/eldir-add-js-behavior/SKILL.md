---
name: eldir-add-js-behavior
description: Add or update Drupal behaviors in Eldir JavaScript. Use when implementing interactive UI behavior that must be attach/detach-safe for AJAX and progressive enhancement.
---

# Eldir Add JS Behavior

1. Add behavior in `js/eldir.js` under `Drupal.behaviors`.
2. Use `once('<key>', '<selector>', context)` for idempotent attach.
3. Use `context` scoping; do not assume full-document attach.
4. Add `detach()` cleanup when using intervals, observers, or external listeners.
5. Use `Drupal.t()` and `drupalSettings` where appropriate.
6. Ensure no behavior duplicates existing functionality.

## Guardrails

- Keep behavior names explicit and prefixed with `eldir`.
- Prefer small focused behaviors over one large handler.
