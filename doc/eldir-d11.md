# Eldir (Drupal 11) Theme System Architecture Document

## Scope
This document describes how to implement the Eldir theme for Drupal 11 using current theming best practices and Drupal 11 core architecture. It is based on the Drupal 7 Eldir theme documented in `architecture/eldir-d7.md`, preserving layout intent, key selectors, and Aegir-specific UI patterns while modernizing templates, preprocessors, and asset handling.

## Goals and constraints
- Preserve the Eldir visual identity and layout structure from Drupal 7.
- Keep Aegir-specific selectors and UI behaviors that modules may rely on.
- Align with Drupal 11 theming (Twig, libraries, asset pipelines, SDC).
- Provide a maintainable, component-oriented template structure.

## Drupal 11 theming architecture overview
- Templates are Twig (`*.html.twig`), not PHP templates.
- Theme info is defined in `eldir.info.yml`.
- Assets are attached via `eldir.libraries.yml` and `attach_library()`.
- Preprocess logic lives in `eldir.theme` using `hook_preprocess_HOOK()` and `hook_theme()`.
- Single Directory Components (SDC) can be used for reusable UI blocks.
- Layouts can be provided by core Layout Builder or theme templates.

## Theme file structure (proposed)
```
eldir/
  eldir.info.yml
  eldir.libraries.yml
  eldir.settings.yml
  eldir.theme
  eldir.breakpoints.yml
  config/
    install/
      block.block.eldir_main_menu.yml
      block.block.eldir_secondary_menu.yml
  templates/
    html.html.twig
    page.html.twig
    page--user--login.html.twig
    page--user--register.html.twig
    page--user--password.html.twig
    menu--main.html.twig
    menu--secondary.html.twig
    node.html.twig
    block.html.twig
    region.html.twig
    item-info-listing.html.twig
  components/
    header/
      header.twig
      header.css
    navigation/
      navigation.twig
      navigation.css
    console/
      console.twig
      console.css
    footer/
      footer.twig
      footer.css
  css/
    base.css
    layout.css
    components.css
    aegir.css
  images/
    raster/
      sprite.png
      page.png
      bleeds.png
      buttons.png
      grid_e8.png
    svg/
      aegir_logo_horizontal.svg
      aegir_logo.svg
      aegir_sprite.svg
      aegir_icons.svg
  logo.png
```

## Theme metadata and regions
- `eldir.info.yml`
  - `name: Eldir`
  - `type: theme`
  - `core_version_requirement: ^11`
  - `base theme: stable9`
  - `libraries-override:` used to replace any core module styling that must be themed (overlay-style CSS if still required).
  - `libraries:` include core and Eldir libraries.
  - `regions:`
    - `navigation`
    - `header`
    - `help`
    - `content`
    - `content_bottom`
    - `sidebar_first`
    - `sidebar_second`
    - `footer`

Region placement mirrors Drupal 7:
- `navigation` renders in the navigation bar.
- `header` renders before page title and tabs.
- `help` renders above main content.
- `content` is main page content.
- `content_bottom` renders after main content.
- `sidebar_first` and `sidebar_second` render in the right sidebar.
- `footer` renders before the secondary menu.

## Templates and layout
### Document shell
- `templates/html.html.twig`
  - Outputs HTML5 doctype, language attributes, RDF namespaces (if enabled), and body classes.
  - Adds the `aegir` class and preserves path- and node-type classes.
  - Includes skip link for accessibility.

### Page layout
- `templates/page.html.twig`
  - Main wrapper: `#page-wrapper`.
  - Header: `#header.reverse` with logo and site name.
  - Navigation: `#navigation.reverse` with breadcrumb and `page.navigation` region.
  - Console: `#console.reverse` with message output.
  - Header region: `#header-region` for header blocks, page title, and primary tabs.
  - Main content: `#page > #main > .page-content` for help, content, content_bottom, feed icons.
  - Sidebar: `#right.sidebar` for `sidebar_first` and `sidebar_second`.
  - Footer: `#footer.reverse` with footer region and secondary menu.

### Menus
- `templates/menu--main.html.twig`
  - Uses `.links.inline.clearfix` and `#main-menu` to preserve legacy selectors.
- `templates/menu--secondary.html.twig`
  - Uses `.links.inline` and `#secondary-menu` to match D7 selectors and footer styling.

### Auth pages
- `templates/page--user--login.html.twig`
- `templates/page--user--register.html.twig`
- `templates/page--user--password.html.twig`
  - Render the simplified auth box layout (`#auth_box`) from D7.
  - Keep top/middle/bottom parts for logo, title/messages, and cross-links.

### Custom theme hook template
- `templates/item-info-listing.html.twig`
  - Replaces D7 theme function for hosting info tables.
  - Renders a table with `.hosting-info-table`, `.item-title`, `.item-value`.

## Preprocess and theme hooks (eldir.theme)
### Preprocess hooks
- `eldir_preprocess_html()`
  - Adds `aegir` body class.
  - Adds `node-page` and `ntype-<type>` when a node is present.
  - Adds `path-<current_path>` class for path-based styling.

- `eldir_preprocess_page()`
  - Adds `svg_logo` when theme logo contains `eldir`, enabling SVG substitution.
  - Maps primary/secondary tabs and action links into header and secondary tabs.
  - Ensures title is set from node or route title.
  - Prefixes page title with node type label when appropriate.
  - Exposes `$tabs2` equivalent for D7-style secondary tabs placement.

- `eldir_preprocess_node()`
  - Adds node type label to node titles.
  - Converts `content.info` into structured table rows for `item-info-listing`.

### Theme hooks
- `eldir_theme()`
  - Registers `item_info_listing` using `item-info-listing.html.twig`.

### D11-specific data mapping notes
- Primary and secondary tabs are exposed in Twig as `primary_tabs` and `secondary_tabs`; action links are available via `action_links` and should be rendered where D7 put secondary tabs.
- `$breadcrumb` becomes the `breadcrumb` variable in Twig; keep it in `#navigation` with `.breadcrumb`.
- Messages are rendered via `messages` and should stay inside `#console`.

### Optional hook suggestions
- `eldir_theme_suggestions_page_alter()`
  - Adds route-based suggestions for auth pages if needed.
  - Add suggestions for Aegir-specific routes to map node types to templates when markup needs per-type adjustments.

## Styling and asset strategy
### Libraries
- `eldir.libraries.yml`
  - `global-styling` loads `css/base.css`, `css/layout.css`, `css/components.css`, `css/aegir.css`.

### CSS organization
- `css/base.css`: reset, typography, link styles, form controls.
- `css/layout.css`: header/nav/page/sidebar/footer layout, limiter, grid background.
- `css/components.css`: tabs, menus, blocks, messages, buttons, tables.
- `css/aegir.css`: Aegir-specific UI (hosting tables, task buttons, queue forms).

### Assets
- Raster assets remain in `images/raster/` and are referenced by CSS.
- SVG logo sources in `images/svg/` are referenced for modern SVG logo output.
- `logo.png` retained at theme root for fallback and theme settings.

### Theme settings
- `eldir.settings.yml` should expose:
  - Logo usage (SVG vs raster).
  - “Wide layout” toggle to apply `body.wide` class.

### Default block placement
- `block.block.eldir_main_menu.yml` places the Main menu block in the `navigation` region.
- `block.block.eldir_secondary_menu.yml` places the Secondary menu block in the `footer` region.

## Selector compatibility (carry-over from D7)
These selectors should be preserved or reintroduced in Twig templates and CSS to maintain compatibility with Aegir UI and existing behavior:
- Layout: `#page-wrapper`, `.limiter`, `#page`, `#main`, `#right.sidebar`, `.page-content`.
- Header/nav: `#header`, `#navigation`, `.logo img`, `.site-name`, `#main-menu`, `#secondary-menu`.
- Console: `#console`, `.messages`, `.error`, `.warning`, `.ok`.
- Tabs/actions: `ul.tabs`, `ul.primary`, `ul.secondary`, `ul.action-links`.
- Nodes: `.node`, `.node-page`, `.ntype-<type>`, `.page-title`, `.label`.
- Sidebar: `.sidebar .block`, `.sidebar ul.menu`, `.sidebar .item-list`.
- Aegir: `.hosting-info-table`, `.hosting-button-enabled`, `.hosting-button-disabled`, `#hosting-task-log`.
- Auth pages: `body.not-logged-in.page-user`, `#auth_box`, `#top_part`, `#middle_part`, `#bottom_part`.

## Rendering flow (Drupal 11)
1. Theme registry loads `eldir.info.yml` and `eldir.libraries.yml`.
2. Preprocess hooks in `eldir.theme` prepare variables.
3. `html.html.twig` renders the page shell and body classes.
4. `page.html.twig` composes layout and regions.
5. Route-specific page templates override default layout (auth pages).
6. Component templates (optional SDC) render header/navigation/footer blocks.
7. Libraries attach CSS/JS to the page and components.

## Migration notes from Drupal 7
- Replace `page.tpl.php` with `page.html.twig` and move PHP logic into preprocess.
- Replace theme functions with Twig templates and preprocess mapping.
- Remove legacy IE6 support and `ie6.css`.
- Replace `hook_css_alter()` with library overrides and `libraries-override` in `eldir.info.yml`.

## D7 source-driven behaviors to preserve
- **SVG logo substitution**: when logo is the theme default, prefer `images/svg/aegir_logo_horizontal.svg`.
- **Node-type label in titles**: prepend `<span class="label">Type</span>` to titles on node pages.
- **Info listing tables**: convert Aegir info render arrays into `.hosting-info-table` rows with `.item-title` and `.item-value`.
- **Console message styles**: keep `#console` reverse palette and severity classes.
- **Auth layout**: `#auth_box` with `#top_part`, `#middle_part`, `#bottom_part`.

## Implementation checklist (minimal)
- Create `eldir.info.yml`, `eldir.libraries.yml`, `eldir.theme`, `eldir.settings.yml`.
- Port `html.tpl.php` to `templates/html.html.twig` with `aegir` class and skip link.
- Port `page.tpl.php` and auth templates to Twig with matching IDs/classes.
- Add menu templates to preserve `#main-menu` and `#secondary-menu` selectors.
- Split and port CSS from D7 into `css/` layers, preserving selectors.
- Implement preprocess hooks for title labels, tab placement, and info listings.
- Verify Aegir task pages, server/platform/site info pages, and user auth pages.
## Verification checklist
- Aegir hosting entities: server/platform/site/package nodes display `.hosting-info-table` and type labels.
- Task pages: `.ntype-task` styles apply to task forms and queues.
- Navigation: main menu appears inside `#navigation` and secondary menu inside `#footer`.
- Auth pages: `/user/login`, `/user/register`, `/user/password` show `#auth_box` layout.
- Console messages: status/warning/error messages render within `#console` with expected colors.

## Open implementation decisions
- Whether to use SDC components for header/nav/footer or keep classic templates only.
- Whether to integrate Layout Builder for page regions or maintain template-driven layout.

## Next steps
- Implement `eldir.info.yml`, `eldir.libraries.yml`, and `eldir.theme`.
- Port templates to Twig and align markup with required selectors.
- Split and modernize CSS while retaining Eldir visual cues.
- Verify Aegir-specific UI pages for selector and layout compatibility.
