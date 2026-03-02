# Eldir Theme — Development TODO

## Drupal 11 Theming Standards

### Single Directory Components (SDC)

- [ ] Migrate existing component templates to SDC format
  - [ ] `hosting-status-badge` → `components/hosting-status-badge/`
  - [ ] `hosting-panel` → `components/hosting-panel/`
  - [ ] `hosting-task-card` → `components/hosting-task-card/`
  - [ ] `hosting-entity-chip` → `components/hosting-entity-chip/`
- [ ] Create `*.component.yml` schema files for each component
- [ ] Move component-specific CSS into SDC directories
- [ ] Move component-specific JS into SDC directories (if applicable)
- [ ] Remove manual `hook_theme()` registrations replaced by SDC auto-discovery
- [ ] Update hosting module render arrays to use SDC component names (`{theme}:{component}`)
- [ ] Update preprocess functions to work with SDC variable schema

### Modern Base Theme

- [x] Evaluate migration from `stable9` to `starterkit` or `stable` base theme
  - Evaluated `stable9`, `starterkit_theme`, Claro, Bootstrap Barrio/Bootstrap5/Radix
  - **Decision**: `base theme: false` (D11 core pattern — Claro, Olivero, Stark all use this)
  - Claro rejected: `@internal`, 5/8 regions missing, aggressive admin CSS conflicts
  - Bootstrap themes rejected: template markup uses Bootstrap CSS classes incompatible with Eldir's BEM/custom-property CSS
  - 79 stable9 templates (CRITICAL + IMPORTANT) copied into `templates/` for full markup ownership
  - 40 templates intentionally skipped (media library, multilingual, CKEditor, search, comments, taxonomy, image effects, RSS)
- [x] Review Drupal 11 theme API deprecations and update accordingly
  - `theme_get_setting()` deprecated D11.3 (removed D13) — all 9 calls replaced with `\Drupal::service(ThemeSettingsProvider::class)->getSetting()`
  - `base_path()`, `hook_theme()`, `hook_theme_suggestions_HOOK_alter()` — NOT deprecated, no action needed
  - Core `template_preprocess_*()` functions moving to service classes (D11.2–D11.3) — Eldir's `eldir_preprocess_*()` overrides are unaffected

### Template Modernization

- [ ] Add type hints to all preprocess function signatures
- [ ] Audit `\Drupal::` global calls in `eldir.theme` — replace with service injection where possible (theme service decorators)
- [ ] Create missing `hosting-platform.html.twig` entity template
- [ ] Add `hosting-client.html.twig` entity template

### CSS Modernization

- [ ] Evaluate CSS nesting (native) to replace flat BEM selectors
- [ ] Evaluate CSS `@layer` for cascade management
- [ ] Evaluate `container` queries for component-level responsiveness
- [ ] Audit CSS custom properties for completeness and naming consistency

### JavaScript Modernization

- [ ] Evaluate migration from `Drupal.behaviors` to ES modules where appropriate
- [ ] Add TypeScript type definitions for settings/drupalSettings
- [ ] Audit `once()` usage for correctness across all behaviors

### Accessibility

- [ ] WCAG AA audit across all templates
- [ ] Add ARIA landmarks to all regions
- [ ] Keyboard navigation testing for all interactive components
- [ ] Color contrast verification for all status states

### Testing

- [ ] Add visual regression testing (BackstopJS or similar)
- [ ] Add accessibility automated testing (axe-core)
- [ ] Create Storybook or pattern library for component documentation
