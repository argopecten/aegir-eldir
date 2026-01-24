# Aegir Eldir Theme Documentation

This directory contains architectural and implementation documentation for the Aegir Eldir theme.

## Documentation Files

### Current Implementation (Drupal 11)

- **[eldir-d11.md](eldir-d11.md)** - System Architecture Document for Drupal 11 implementation
  - Theme structure and organization
  - Twig template implementation
  - CSS architecture and responsive design
  - JavaScript integration
  - Hostmaster-specific UI components
  - Theme settings and configuration
  - Breakpoints and mobile optimization

### Legacy Documentation (Drupal 7)

- **[eldir-d7.md](eldir-d7.md)** - Legacy documentation for Drupal 7 implementation
  - **Note**: The Drupal 7 source code is no longer present in this repository
  - Kept for reference during migration and architectural comparison
  - Documents historical design decisions and D7-specific patterns

## Theme Structure

```
web/themes/aegir-eldir/
├── doc/                      # This directory - architecture documentation
├── templates/                # Twig templates
├── css/                      # Stylesheets
├── images/                   # Theme images and assets
├── config/                   # Theme configuration schemas
├── eldir.theme              # Theme hook implementations
├── eldir.info.yml           # Theme metadata
├── eldir.libraries.yml      # Asset library definitions
├── eldir.breakpoints.yml    # Responsive breakpoints
└── eldir.settings.yml       # Theme settings schema
```

## Integration with Aegir Hostmaster

The Eldir theme is specifically designed for the Aegir Hostmaster interface, providing:

1. **Context-aware navigation** - Dynamic menu system based on server/platform/site contexts
2. **Task status visualization** - Real-time task queue monitoring and status displays
3. **Entity-specific layouts** - Custom layouts for hosting entities (sites, platforms, servers)
4. **Admin workflows** - Streamlined UI for common hosting operations
5. **Responsive design** - Mobile-friendly interface for remote administration

## Reading Order

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

## Related Documentation

- [Aegir Provision Backend](../../../vendor/aegir-provision/doc/provision-d11.md) - Backend hosting automation
- [Hostmaster Hosting Module](../../modules/aegir-hosting/hosting/doc/hosting-d11-sad.md) - Frontend entity system
- [Main Project Documentation](../../../.github/copilot-instructions.md) - AI agent instructions
