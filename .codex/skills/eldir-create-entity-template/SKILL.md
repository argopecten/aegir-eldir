---
name: eldir-create-entity-template
description: Create or update Eldir entity display templates and their presentational preprocess/CSS integration. Use when adding or refining templates like hosting-server/site/task/platform and wiring template variables safely.
---

# Eldir Create Entity Template

1. Confirm the target entity template filename in `templates/` (underscores become hyphens).
2. Create or update Twig markup using BEM classes and documented variables.
3. Add or refine preprocess logic in `eldir.theme` to format variables for rendering only.
4. Add or update styles in `css/aegir.css` or `css/components.css`.
5. Add responsive adjustments in `css/responsive.css` when needed.
6. Check for accessibility basics: headings, semantic sections, labels, color contrast.

## Guardrails

- Keep business logic out of theme code.
- Prefer existing custom components (`hosting_status_badge`, `hosting_panel`, `hosting_task_card`, `hosting_entity_chip`) before introducing duplicate markup.
