# Eldir (Drupal 11) Theme System Architecture Document

## Scope
This document describes the Eldir theme for Drupal 11, which is a modernized implementation based on the Drupal 7 Eldir theme (documented in [eldir-d7.md](eldir-d7.md)). It preserves the Eldir visual identity, layout structure, key selectors, and Aegir-specific UI patterns while using Drupal 11 theming standards (Twig, libraries, asset pipelines).

## Implementation Status
**Status: Implemented and operational** (with ongoing enhancements)

This theme is fully functional and actively used in Aegir Hostmaster Drupal 11 installations. All core features from the Drupal 7 version have been migrated to modern Drupal 11 standards.

**Core Features:**
- ✅ Twig templates for all page types and entity displays
- ✅ CSS architecture (base, layout, components, aegir-specific)
- ✅ Responsive breakpoint definitions
- ✅ Custom theme hook for info tables (`item_info_listing`)
- ✅ Preprocess functions for HTML, page, node, and entities
- ✅ Authentication page layouts (login, register, password)
- ✅ Menu templates (main and secondary)

**In Progress / Planned:**
- ⚠️ JavaScript integration (task queue updates, log filtering)
- ⚠️ Complete mobile responsive optimization
- ⚠️ Theme suggestions for hosting entities
- ⚠️ Single Directory Components (SDC) migration

For detailed implementation status and development roadmap, see [../.github/AI-INSTRUCTIONS.md](../.github/AI-INSTRUCTIONS.md).

## Goals and constraints
- ✅ Preserve the Eldir visual identity and layout structure from Drupal 7
- ✅ Keep Aegir-specific selectors and UI behaviors that modules rely on
- ✅ Align with Drupal 11 theming (Twig, libraries, asset pipelines)
- ✅ Provide a maintainable template structure

## Drupal 11 theming architecture overview
- Templates are Twig (`*.html.twig`), not PHP templates.
- Theme info is defined in `eldir.info.yml`.
- Assets are attached via `eldir.libraries.yml` and `attach_library()`.
- Preprocess logic lives in `eldir.theme` using `hook_preprocess_HOOK()` and `hook_theme()`.
- Single Directory Components (SDC) can be used for reusable UI blocks.
- Layouts can be provided by core Layout Builder or theme templates.

## Theme file structure (actual)
```
eldir/
  composer.json
  eldir.info.yml
  eldir.libraries.yml
  eldir.settings.yml
  eldir.theme
  eldir.breakpoints.yml
  config/
    install/
      block.block.eldir_main_menu.yml
      block.block.eldir_secondary_menu.yml
    schema/
      eldir.schema.yml
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
    hosting-server.html.twig
    hosting-queues-table.html.twig
    hosting-service-status-cell.html.twig
  css/
    base.css
    layout.css
    components.css
    aegir.css
  images/
    raster/
      (sprite.png, page.png, etc.)
    svg/
      aegir_logo_horizontal.svg
      aegir_logo.svg
      aegir_sprite.svg
      aegir_icons.svg
  logo.png
  doc/
    README.md
    eldir-d11.md
    eldir-d7.md
```

## Theme metadata and regions
**File: `eldir.info.yml`**

```yaml
name: Eldir
type: theme
description: Companion theme for the Aegir hosting system.
core_version_requirement: ^11
base theme: stable9
libraries:
  - eldir/global-styling
regions:
  navigation: Navigation
  header: Header
  help: Help
  content: Content
  content_bottom: Content bottom
  sidebar_first: Sidebar top
  sidebar_second: Sidebar bottom
  footer: Footer
```

### Region placement
Region placement matches the Drupal 7 implementation:
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

### Implemented hooks

**`eldir_theme()`**
- Registers `item_info_listing` theme hook with template `item-info-listing.html.twig`
- Used for hosting entity info tables

**`eldir_preprocess_html()`**
- Adds `aegir` body class
- Adds `wide` class when wide layout is enabled via theme settings
- Adds `not-logged-in` class for anonymous users
- Adds `node-page` and `ntype-<type>` classes on node pages
- Adds `auth-page` class for login/register/password pages
- Adds `page-user`, `page-admin`, `path-hosting` classes based on current path
- Generates path-based classes (`path-<current_path>`)

**`eldir_preprocess_page()`**
- Handles messages and breadcrumb fallbacks
- Generates tabs from local task plugins
- Provides SVG logo when enabled and theme logo is used
- Builds main and secondary menus via `eldir_build_menu()`
- Splits tabs into `tabs` (primary) and `tabs2` (secondary) for layout
- Ensures title is set from node or route
- Prefixes node titles with type label (`<span class="label">Type</span>`)
- Exposes `user_register` variable for auth pages

**`eldir_preprocess_node()`**
- Adds type label to node titles
- Converts `content.info` render arrays into `item_info_listing` format
- Applies `eldir_info_table_pre_render()` callback

**Hosting entity preprocessors:**
- `eldir_preprocess_entity__hosting_server()`
- `eldir_preprocess_entity__hosting_site()`
- `eldir_preprocess_entity__hosting_client()`
- `eldir_preprocess_entity__hosting_task()`
- All add data attributes via `eldir_add_entity_metadata_attributes()`
- Site entities get `data-hosting-status` and status-based CSS classes

**Additional preprocessors:**
- `eldir_preprocess_menu__main()` - adds `hosting-main-menu` class
- `eldir_preprocess_menu_local_tasks()` - adds `hosting-local-tasks` class on hosting routes
- `eldir_preprocess_table()` - adds `hosting-table` class on hosting routes
- `eldir_preprocess_form()` - adds `hosting-form` class to hosting forms
- `eldir_preprocess_form_element()` - adds `hosting-form__element` class
- `eldir_preprocess_item_info_listing()` - prepares items and children for table rendering

### Helper functions

**`eldir_info_table_pre_render()`**
- Pre-render callback that converts item-type children into `#items` array
- Extracts title, markup, weight, and description from form elements

**`eldir_form_system_theme_settings_alter()`**
- Adds theme settings form with:
  - `use_svg_logo` - checkbox to prefer SVG logo
  - `wide_layout` - checkbox to enable wide layout

## Additional Resources

For comprehensive implementation details, code examples, and development guidelines, see:

- **[AI-INSTRUCTIONS.md](../.github/AI-INSTRUCTIONS.md)** - Complete technical documentation for developers and AI coding agents
  - Detailed preprocess function implementations
  - CSS architecture and selector reference
  - JavaScript integration patterns (planned)
  - Module integration checklist
  - Development workflow and testing procedures
  - Anti-patterns to avoid
  - Future enhancement roadmap
  - `main_menu_name` - machine name for main menu (default: "main")
  - `secondary_menu_name` - machine name for secondary menu (default: "secondary")

**`eldir_build_menu()`**
- Builds menu render array by menu machine name
- Uses menu tree API with current route parameters
- Special handling for hosting entity add forms

**`eldir_add_entity_metadata_attributes()`**
- Adds standard data attributes to hosting entities:
  - `data-entity-type`
  - `data-entity-id`
  - `data-view-mode`
  - `data-entity-bundle`

## Styling and asset strategy

### Libraries
**File: `eldir.libraries.yml`**

```yaml
global-styling:
  css:
    base:
      css/base.css: {}
      css/layout.css: {}
      css/components.css: {}
      css/aegir.css: {}
```

Loaded via `eldir.info.yml` libraries declaration.

### CSS organization (implemented)
- **`css/base.css`** - Reset, typography, link styles, form controls
- **`css/layout.css`** - Header/nav/page/sidebar/footer layout, limiter, grid background
- **`css/components.css`** - Tabs, menus, blocks, messages, buttons, tables
- **`css/aegir.css`** - Aegir-specific UI (hosting tables, task buttons, queue forms)

### Assets
- Raster assets in `images/raster/` referenced by CSS
- SVG logo sources in `images/svg/` for SVG logo output
- `logo.png` at theme root for fallback and theme settings

### Theme settings
**File: `eldir.settings.yml`**

```yaml
use_svg_logo: true
wide_layout: false
main_menu_name: main
secondary_menu_name: secondary
```

Settings configurable via **Appearance → Settings → Eldir**:
- **Prefer SVG logo** - Use SVG version of theme logo
- **Enable wide layout** - Apply wider layout (adds `body.wide` class)
- **Main menu machine name** - Which menu to use as main menu
- **Secondary menu machine name** - Which menu to use as secondary menu

### Breakpoints
**File: `eldir.breakpoints.yml`**

```yaml
eldir.mobile:
  label: mobile
  mediaQuery: '(min-width: 0px)'
  weight: 0
  multipliers:
    - 1x

eldir.wide:
  label: wide
  mediaQuery: '(min-width: 960px)'
  weight: 1
  multipliers:
    - 1x
```

### Default block placement
**Files in `config/install/`:**
- `block.block.eldir_main_menu.yml` - Places Main menu in `navigation` region
- `block.block.eldir_secondary_menu.yml` - Places Secondary menu in `footer` region

**Config schema:**
- `config/schema/eldir.schema.yml` - Defines schema for theme settings

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
- Replace `hook_css_alter()` with library overrides and `libraries-override` in `eldir.info.yml`

## Key Features Implemented

### Body Classes
The theme adds comprehensive body classes for styling hooks:
- `aegir` - Always present on all pages
- `wide` - When wide layout is enabled
- `not-logged-in` - For anonymous users
- `node-page` - On node pages
- `ntype-{type}` - Node type identifier
- `auth-page` - On login/register/password pages
- `page-user`, `page-admin`, `path-hosting` - Path-based classes
- `path-{current-path}` - Normalized current path

### SVG Logo Support
When "Prefer SVG logo" is enabled and the theme's default logo is used, the theme automatically substitutes the PNG logo with `images/svg/aegir_logo_horizontal.svg`.

### Node Type Labels
Node titles are automatically prefixed with their type label wrapped in `<span class="label">Type</span>` for better visual hierarchy.

### Hosting Entity Data Attributes
All hosting entities receive standardized data attributes:
- `data-entity-type` - Entity type ID
- `data-entity-id` - Entity ID
- `data-view-mode` - Current view mode
- `data-entity-bundle` - Entity bundle
- `data-hosting-status` - Site status (for hosting_site entities)

### Menu Building
Menus are built dynamically from menu names configured in theme settings, with special handling for hosting entity add forms to ensure proper active trail highlighting.

## Selector Compatibility (Preserved from D7)
These selectors are maintained in Twig templates and CSS for Aegir UI compatibility:
- **Layout**: `#page-wrapper`, `.limiter`, `#page`, `#main`, `#right.sidebar`, `.page-content`
- **Header/nav**: `#header`, `#navigation`, `.logo img`, `.site-name`, `#main-menu`, `#secondary-menu`
- **Console**: `#console`, `.messages`, `.error`, `.warning`, `.ok`
- **Tabs/actions**: `ul.tabs`, `ul.primary`, `ul.secondary`, `ul.action-links`
- **Nodes**: `.node`, `.node-page`, `.ntype-<type>`, `.page-title`, `.label`
- **Sidebar**: `.sidebar .block`, `.sidebar ul.menu`, `.sidebar .item-list`
- **Aegir-specific**: `.hosting-info-table`, `.hosting-table`, `.hosting-main-menu`, `.hosting-form`, `.hosting-site--status-*`
- **Auth pages**: `body.not-logged-in.page-user`, `.auth-page`, `#auth_box`

## Implemented Templates
All templates are in `templates/` directory:
- `html.html.twig` - Document shell with body classes
- `page.html.twig` - Main page layout
- `page--user--login.html.twig` - Login page layout
- `page--user--register.html.twig` - Registration page layout
- `page--user--password.html.twig` - Password reset page layout
- `menu--main.html.twig` - Main menu with preserved selectors
- `menu--secondary.html.twig` - Secondary menu with preserved selectors
- `node.html.twig` - Node display with type labels
- `block.html.twig` - Block wrapper
- `region.html.twig` - Region wrapper
- `item-info-listing.html.twig` - Hosting info table template
- `hosting-server.html.twig` - Server entity display
- `hosting-queues-table.html.twig` - Task queue table
- `hosting-service-status-cell.html.twig` - Service status indicator

## D7-to-D11 Feature Parity

### Preserved Behaviors
✅ SVG logo substitution when theme logo is used  
✅ Node-type label prefixing in titles  
✅ Info listing tables (`.hosting-info-table`)  
✅ Console message styles with severity classes  
✅ Auth page layout (`#auth_box` structure)  
✅ Wide layout toggle via theme settings  
✅ Path-based and node-type body classes  
✅ Primary/secondary tab separation  

### Modernized Implementations
- ✅ Twig templates replace PHP templates
- ✅ Preprocess hooks replace theme functions
- ✅ Theme settings form integration
- ✅ Menu building via Menu Tree API
- ✅ Entity data attributes for modern JS integration
- ✅ Responsive breakpoints defined
- ✅ Config schema for settings validation

## Verification Checklist
✅ Aegir hosting entities display `.hosting-info-table` and type labels  
✅ Task pages apply `.ntype-task` styles  
✅ Main menu appears in `#navigation` region  
✅ Secondary menu appears in `#footer` region  
✅ Auth pages (`/user/login`, `/user/register`, `/user/password`) show `#auth_box` layout  
✅ Console messages render with expected severity colors  
✅ SVG logo substitution works when enabled  
✅ Wide layout applies when enabled  
✅ Hosting entity data attributes are present  

## Development Notes

### Adding New Hosting Entity Support
To add support for new hosting entity types:
1. Create preprocess hook: `eldir_preprocess_entity__hosting_ENTITY()`
2. Call `eldir_add_entity_metadata_attributes($variables)`
3. Add entity-specific logic as needed
4. Create custom template if needed: `templates/hosting-ENTITY.html.twig`

### Customizing Info Tables
Info tables use the `item_info_listing` theme hook. To customize:
1. Modify `eldir_preprocess_item_info_listing()` for data preparation
2. Edit `templates/item-info-listing.html.twig` for markup
3. Style with `.hosting-info-table` selectors in `css/aegir.css`

### Theme Settings
Theme settings are exposed via `eldir_form_system_theme_settings_alter()` and stored in theme config. Access via `theme_get_setting('setting_name')`.

## Implementation Status Summary
**Status: Complete and Production-Ready**

All core features from Drupal 7 have been successfully migrated to Drupal 11. The theme maintains visual and functional parity with the D7 version while using modern Drupal 11 APIs and best practices.
