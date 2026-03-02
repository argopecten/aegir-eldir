# Eldir Theme - User Guide

Modern admin theme for Aegir Hosting. Preserves the classic D7 look and feel with responsive design and accessibility improvements.

## Features

### Design
- Classic Eldir color scheme and layout
- Responsive (works on mobile, tablet, desktop)
- WCAG AA accessible
- Smooth transitions and hover effects

### Components
- **Status Badges** - Color-coded indicators for entity states
- **Collapsible Panels** - Organize content efficiently
- **Task Cards** - Enhanced task display with logs
- **Entity Chips** - Compact links to related entities

### Interactions
- Mobile-friendly navigation
- Keyboard navigation support
- Smooth scrolling
- Copy-to-clipboard for logs
- Auto-expanding textareas
- Real-time form validation

## Theme Settings

Access at `/admin/appearance/settings/eldir`

**Prefer SVG Logo**  
Use vector logo instead of raster (recommended for HiDPI displays)

**Enable Wide Layout**  
Increase container width from 940px to 950px

**Main Menu Name**  
Machine name of primary navigation menu (default: `main`)

**Secondary Menu Name**  
Machine name of secondary navigation menu (default: `secondary`)

## Color Palette

### Primary Colors
- **Accent**: `#6ac` (Aegir teal)
- **Header**: `#666` (dark gray, reversed sections)
- **Primary**: `#16527f` (auth page gradient start)
- **Primary Dark**: `#151f3e` (auth page gradient end)

### Status Colors
- **Success**: Green (`#0a7a0a` text, `#dff6cf` background)
- **Error**: Red (`#c00` text, `#f1c6c6` background)
- **Warning**: Yellow (`#c80` text, `#fff3cd` background)
- **Info**: Blue (`#00a` text, `#e6f6ff` background)

### Backgrounds
- **White**: `#fff`
- **Subtle**: `#f8f8f8` (light gray)
- **Grid**: `#e8e8e8` (texture pattern)
- **Border**: `#e8e8e8`

## Responsive Breakpoints

- **Mobile**: 0-768px (stacked layout, mobile menu)
- **Tablet**: 768-1024px (hybrid layout)
- **Desktop**: 1024-1280px (standard layout)
- **Wide**: 1280-1600px (more spacing)
- **Ultrawide**: 1600px+ (optimal spacing)

## Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate buttons and links
- **Escape** - Close menus and modals
- **Arrow keys** - Navigate within menus

Focus indicators are visible when using keyboard navigation.

## Accessibility

### Screen Readers
- Proper ARIA landmarks
- Descriptive labels on all controls
- Heading hierarchy maintained
- Skip links to main content

### Color Contrast
All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

## Browser Support

### Supported
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Not Supported
- Internet Explorer 11 and older

## Customization

### CSS Variables

Override design tokens in your custom CSS or subtheme:

```css
:root {
  --color-accent: #0066cc;
  --spacing-md: 20px;
  --font-size-base: 14px;
}
```

See `css/variables.css` for all available variables.

### Creating a Subtheme

1. Create subtheme directory: `themes/custom/my_eldir/`
2. Create `my_eldir.info.yml`:
   ```yaml
   name: My Eldir
   type: theme
   base theme: eldir
   core_version_requirement: ^11
   ```
3. Override templates, CSS, or JavaScript as needed

## Performance

- CSS is optimized and minification-ready
- No external dependencies
- Progressive enhancement (works without JavaScript)
- Efficient selectors
- Modern browser features only

## Troubleshooting

**Theme looks different after update**  
Clear Drupal cache: `drush cr`

**Mobile menu not working**  
Ensure JavaScript is enabled and `js/eldir.js` is loading

**Colors seem wrong**  
Check for conflicting CSS from other themes or modules

**Layout is broken**  
Verify no custom CSS is overriding core layout styles

## Support

For technical documentation, see [Developer Guide](eldir-d11.md)

For D7 design reference, see [D7 Documentation](eldir-d7.md)## Reading Order

For developers working on the theme:

1. Start with **[eldir-d11.md](eldir-d11.md)** for current implementation
2. Reference **eldir-d7.md** only when understanding migration decisions or historical context
3. Check `eldir.theme` for hook implementations and custom logic
4. Review `templates/` for Twig template structure

## Theme Development Guidelines

- **Twig templates only** - No PHP in templates, use preprocess hooks in `eldir.theme`
- **CSS organization** - Follow BEM methodology for class naming
- **JavaScript** - Use Drupal behaviors, avoid inline scripts
- **Accessibility** - WCAG 2.1 AA compliance required
- **Performance** - Optimize asset loading, use libraries.yml for dependencies

## AI-Assisted Development

For detailed implementation guidance, coding patterns, and comprehensive API documentation, see:

- **[AI-INSTRUCTIONS.md](../.github/AI-INSTRUCTIONS.md)** - Complete theme architecture guide
  - Custom theme hooks and usage patterns
  - Preprocess function implementations
  - CSS architecture and responsive design
  - JavaScript integration patterns
  - Module integration checklist
  - Anti-patterns to avoid
  - Future development roadmap

## Related Documentation

- [Eldir D11 Architecture](eldir-d11.md) — Developer guide
- [Eldir D7 Reference](eldir-d7.md) — Historical design reference
- [Eldir TODO](TODO.md) — Development roadmap
- [AI Instructions](../.github/AI-INSTRUCTIONS.md) — Theme development guide for AI agents
