# Eldir theme

Eldir is a Drupal theme originally built for the Aegir hosting system. This version targets Drupal 11 with Twig templates and modern theme metadata.

## Requirements

- Drupal core 11
- Drush 13 (optional, for CLI workflows)

## Installation

1. Place this theme in your Drupal `themes/custom/eldir` directory (or the appropriate location in your project).
2. Clear caches with `drush cr`.
3. Enable the theme and set it as default if desired (for example: `drush theme:enable eldir` and `drush config:set system.theme default eldir -y`).
4. Place menu blocks into the `Primary menu` and `Secondary menu` regions if you want them to display.

## Regions

- Header
- Breadcrumb
- Primary menu
- Secondary menu
- Sidebar top
- Sidebar bottom
- Content
- Content bottom
- Footer
- Help

## Theme features

- Twig-based templates for Drupal 11.
- SVG logo support when using the default theme logo.
- Custom rendering for info listings into a table.
- Page-specific templates for user login, password, and registration pages.

## Assets

- Global CSS: `style.css`
- Images: `images/`
- Source SVGs: `images-source/`

## Notes

- If you use a custom logo, the SVG override will not apply. To force the SVG logo, disable the custom logo and use the default logo setting.
- Clear caches after template changes with `drush cr`.

## License

No license file is included in this repository. Add one if you need explicit licensing terms.
