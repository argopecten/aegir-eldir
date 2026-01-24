# Eldir (Drupal 7) Theme Architecture

## Scope
This document covers only the Eldir Drupal 7 theme found in this repository. It describes templates, layouts, styles, theme functions, and assets that shape the UI for Aegir hosting pages.

## Theme metadata
- **Theme definition**: `eldir.info`
  - Name: Eldir
  - Core: Drupal 7.x, PHPTemplate engine
  - Stylesheets: `style.css`
  - Conditional stylesheet: `ie6.css` for `lt IE 7`
  - Regions: `header`, `help`, `content`, `content_bottom`, `sidebar_first`, `sidebar_second`, `footer`

## Template and layout structure
### Document shell
- `html.tpl.php`
  - XHTML+RDFa doctype with RDF namespaces and GRDDL profile.
  - Adds `body` class prefix `aegir` plus `$classes` and `$attributes`.
  - Includes skip link for accessibility.
  - Renders `$page_top`, `$page`, `$page_bottom`.

### Page layout
- `page.tpl.php`
  - Overall wrapper: `#page-wrapper`.
  - **Header** (`#header.reverse`): logo + site name.
  - **Navigation** (`#navigation.reverse`): breadcrumb and main menu links.
  - **Console** (`#console.reverse`): system messages, only when `$messages` present.
  - **Header region** (`#header-region`): region output + page title + primary tabs.
  - **Main content** (`#page`):
    - Secondary tabs and action links.
    - Main column (`#main > .page-content`) contains help, content, content_bottom, feed icons.
    - Right sidebar (`#right.sidebar`) combines `sidebar_first` and `sidebar_second`.
  - **Footer** (`#footer.reverse`): footer region + secondary menu.

### Regions and placement
- `header`: rendered in `#header-region` before the page title and tabs.
- `help`: rendered at the top of `#main > .page-content`.
- `content`: primary page content, rendered in `#main > .page-content`.
- `content_bottom`: rendered after main content in `#main > .page-content`.
- `sidebar_first`: rendered in `#right.sidebar` before `sidebar_second`.
- `sidebar_second`: rendered in `#right.sidebar` after `sidebar_first`.
- `footer`: rendered in `#footer.reverse` before the secondary menu.

### User auth overrides
- `templates/page--user--login.tpl.php`
- `templates/page--user--register.tpl.php`
- `templates/page--user--password.tpl.php`
  - All three render a simplified auth layout (`#auth_box`) with logo, title, messages, and form content.
  - Bottom section provides login/register/password cross-links depending on context and `user_register` setting.

## Theme functions and preprocess logic
All theme hooks are defined in `template.php`.

### Preprocess hooks
- `eldir_preprocess_page()`
  - Adds `svg_logo` when theme logo path contains `eldir`, swapping `logo.png` for `images/svg/aegir_logo_horizontal.svg`.
  - Detects overlay child mode and exposes `$overlay`.
  - Splits local tasks into `$tabs` (primary) and `$tabs2` (secondary), moving `action_links` into secondary tabs.
  - Ensures `$title` is set, defaulting to node title or `drupal_get_title()`.
  - On node pages outside overlay, prefixes page title with a node type label.

- `eldir_preprocess_html()`
  - Adds body classes for node pages: `node-page` and `ntype-<type>`.
  - Adds a path-derived class: `path-<current_path>`.

- `eldir_preprocess_node()`
  - Adds node type label to node titles.
  - Converts `content[info]` render arrays into a custom table presentation via `item_info_listing` and `eldir_info_table_pre_render()`.

### Theme hooks
- `eldir_theme()`
  - Registers `item_info_listing` theme hook with render element `info_listing`.

### Custom theme implementations
- `eldir_item_info_listing()`
  - Normalizes `#items`, assigns weights if missing, sorts by weight.
  - Outputs a themed `table` with rows containing `item-title` and `item-value` cells.
  - Preserves non-item children in the render array.

- `eldir_info_table_pre_render()`
  - Converts child `#type = item` elements with `#title/#markup` into `#items` entries for table rendering.

### CSS override integration
- `eldir_css_alter()`
  - Replaces core overlay child CSS with theme-specific `overlay-child.css` when `modules/overlay/overlay-child.css` is present.

## Styling architecture
### Core stylesheet
- `style.css`
  - **Reset and base styles**: normalization of lists, headings, tables, and common admin elements; base typography (`Helvetica Neue`, Arial).
  - **Layout system**: 940px fixed limiter, two-column layout with 600px main + 300px sidebar; `body.wide` variant expands main to 950px.
  - **Navigation and tabs**: styling for menus, primary/secondary tabs, action links.
  - **Header and footer**: sprite-based backgrounds with reversed color palette.
  - **Content blocks and forms**: admin form layout, fieldsets, special handling for Aegir task UI and data tables.
  - **Aegir-specific UI**: info tables (`hosting-info-table`), task lists, hosting buttons, task forms, and scheduling widgets.
  - **Login experience**: gradient background for `body.not-logged-in.page-user` and auth box styling.
  - **Accessibility tweaks**: ensures table widths and sticky headers behave in admin screens.

### Selector reference (layout and UI)
- Page shell: `#page-wrapper`, `.limiter`, `#page`, `#main`, `#right.sidebar`, `.page-content`.
- Header and navigation: `#header`, `#navigation`, `.logo img`, `.site-name`, `#main-menu`, `#secondary-menu`.
- Messages: `#console`, `#console .messages`, `#console .error`, `#console .warning`, `#console .ok`.
- Tabs and actions: `ul.tabs`, `ul.primary`, `ul.secondary`, `ul.action-links`.
- Content and nodes: `.node`, `.node-page`, `.ntype-<type>`, `.page-title`, `.label`.
- Sidebar blocks: `.sidebar .block`, `.sidebar ul.menu`, `.sidebar .item-list`.
- Tables: `.hosting-table`, `.hosting-info-table`, `.views-table`, `#user-admin-perm`.
- Forms: `form .form-item`, `.form-item-labeled`, `input.form-text`, `input.form-submit`, `fieldset`, `.vertical-tabs`.
- Auth pages: `body.not-logged-in.page-user`, `#auth_box`, `#top_part`, `#middle_part`, `#bottom_part`.
- Overlay mode: `.overlay`, `#overlay`, `#overlay-content`, `#overlay-titlebar`, `#overlay-close`.

### Overlay-specific styles
- `overlay-child.css`
  - Adjusts layout for Drupal overlay child mode (modal-style content rendering).
  - Hides header/navigation/footer, adjusts `#header-region` to a compact sticky bar.
  - Resets limiter widths and removes page background images.

### Legacy IE fixes
- `ie6.css`
  - Provides hasLayout fixes and fieldset/legend adjustments for IE6.

## Assets and imagery
- Logos and icons
  - Primary logo: `logo.png` with optional SVG replacement from `images/svg/aegir_logo_horizontal.svg`.
  - Additional SVG sources: `images/svg/aegir_logo.svg`, `images/svg/aegir_sprite.svg`, `images/svg/aegir_icons.svg`.
- UI textures and sprites
  - `images/raster/sprite.png`, `images/raster/page.png`, `images/raster/bleeds.png`, `images/raster/buttons.png`, `images/raster/grid_e8.png`.

## Rendering flow (high-level)
1. Drupal invokes theme hooks and preprocessors defined in `template.php`.
2. `html.tpl.php` outputs the document shell and body classes.
3. `page.tpl.php` composes the main layout regions and navigation.
4. Page-specific templates (login/register/password) override layout for auth routes.
5. `style.css` plus overlay/IE conditionals provide final layout and theming.

## Notable extension points
- Override/extend theme regions by editing `eldir.info` and `page.tpl.php`.
- Customize Aegir info tables by adjusting `eldir_item_info_listing()` or the `.hosting-info-table` rules.
- Overlay presentation is controlled through `eldir_css_alter()` and `overlay-child.css`.
