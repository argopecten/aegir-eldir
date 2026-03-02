# Eldir Theme Context (Codex)

## Scope

Repository: `web/themes/contrib/aegir-eldir/`.

This repo is the Drupal 11 theme layer for Aegir. Work here is limited to Twig templates, CSS, JS Drupal behaviors, and preprocess functions in `eldir.theme`.

## Boundaries

- Do: template structure, presentational preprocess variables, component markup, styling, responsive behavior, accessibility improvements.
- Do not: entity business logic, task queue orchestration, backend provisioning commands.

## Core Rules

- Treat this as a theme, not a module: no `src/`, no services, no plugin classes.
- Keep preprocess logic presentational only.
- Use BEM class naming.
- Use CSS custom properties in `css/variables.css` instead of hardcoded design values.
- Follow mobile-first responsive approach with breakpoints from `eldir.breakpoints.yml`.
- Use Drupal behaviors with `once()` and `context` safety.
- Maintain WCAG AA accessibility.

## Important Files

- `eldir.theme` (theme hooks + preprocess functions)
- `templates/` (Twig templates)
- `css/variables.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/aegir.css`, `css/responsive.css`
- `js/eldir.js`
- `eldir.info.yml`, `eldir.libraries.yml`, `eldir.breakpoints.yml`

## Architecture Reminder

Render arrays from module layer are transformed by preprocess functions and rendered in Twig. Keep module-facing assumptions minimal and defensive in theme code.
