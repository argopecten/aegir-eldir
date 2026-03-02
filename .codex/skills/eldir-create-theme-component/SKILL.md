---
name: eldir-create-theme-component
description: Create reusable Eldir theme-hook components end to end. Use when a UI element should be implemented as a custom theme hook with Twig template, preprocess formatting, and reusable CSS.
---

# Eldir Create Theme Component

1. Register the custom hook in `eldir_theme()` in `eldir.theme`.
2. Define minimal variables and include `attributes` support.
3. Create Twig template in `templates/components/`.
4. Add `eldir_preprocess_<hook>()` only for presentation formatting.
5. Add BEM styles in `css/components.css`.
6. Replace repeated inline markup with this component where appropriate.

## Guardrails

- Keep variable names consistent across hook registration, preprocess, and Twig.
- Use CSS custom properties for spacing, color, radius, and typography.
