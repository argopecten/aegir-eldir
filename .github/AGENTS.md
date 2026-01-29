# AI Agent Quick Reference - aegir-eldir

**Repository**: Theme Component (Eldir Theme)  
**Current Location**: `/var/aegir/aegir-2601/web/themes/contrib/aegir-eldir/`  
**GitHub**: https://github.com/argopecten/aegir-eldir  
**Part of**: Aegir Hostmaster (multi-repository project)

## You Are Here

This is the **Theme Component** - a standalone Git repository that is also a submodule of the main aegir-hostmaster project.

**This component handles**:
- ✅ Twig templates (page, node, entity-specific)
- ✅ CSS (variables, BEM components, responsive layout)
- ✅ JavaScript (Drupal.behaviors)
- ✅ Preprocess functions (eldir.theme)
- ✅ Theme libraries and assets
- ❌ Entity logic (that's aegir-hosting)
- ❌ Form validation (that's aegir-hosting)
- ❌ Backend operations (that's aegir-provision)

## Development Environment

**Target Platform**: Ubuntu 24.04 LTS or later versions  
**Technology Stack**:
- Drupal 11.x
- PHP 8.3+
- Modern CSS3 (custom properties, flexbox, grid)
- Modern JavaScript (ES6+)

## Development Guidelines

**Critical Rules**:
1. ⚠️ **Breaking changes allowed** - We ignore backward compatibility
2. ⚠️ **No update hooks** - Do NOT create update hooks unless explicitly requested
3. 📝 **Documentation on request only** - Update docs only when specifically asked
4. 🎨 **Modern CSS/JS only** - Use CSS variables, flexbox, grid, ES6+ freely
5. 🔄 **Clean implementation** - Prioritize modern patterns over legacy support
6. ♿ **WCAG AA required** - All UI must meet accessibility standards

## Essential Documentation

**Start here for this component**:
- **[AI-INSTRUCTIONS.md](AI-INSTRUCTIONS.md)** - Complete technical guide for this component (1200+ lines)
- **[doc/Home.md](../doc/Home.md)** - User-facing documentation

**For cross-component work**:
- **[Parent Repo AI Guide](../../../../.github/AI-AGENT-GUIDE.md)** - Navigation across all 4 repositories
- **[Parent Repo Architecture](../../../../.github/ARCHITECTURE.md)** - Integration architecture

## Related Components

**Frontend** (when you need to understand entity data):
- Path: `../../modules/contrib/aegir-hosting/`
- AI Docs: [../../../modules/contrib/aegir-hosting/.github/AI-INSTRUCTIONS.md](../../../modules/contrib/aegir-hosting/.github/AI-INSTRUCTIONS.md)

**Backend** (when you need to understand infrastructure):
- Path: `../../drush/Commands/contrib/aegir-provision/`
- AI Docs: [../../../drush/Commands/contrib/aegir-provision/.github/AI-INSTRUCTIONS.md](../../../drush/Commands/contrib/aegir-provision/.github/AI-INSTRUCTIONS.md)

## Quick Navigation

```bash
# Check context
pwd                    # Should show: .../aegir-eldir
git remote -v          # Should show: argopecten/aegir-eldir

# Work in this component
git status             # Shows changes in eldir only
git checkout -b feat   # Creates branch in eldir repo

# Commit workflow
git add . && git commit -m "message"  # Commit in eldir
cd ../../../../                        # Go to parent repo
git add web/themes/contrib/aegir-eldir  # Stage submodule update
git commit -m "Update eldir"           # Commit in parent
```

## Component Boundaries

**You should modify files here when**:
- Adding/changing Twig templates
- Updating CSS styles or variables
- Modifying JavaScript behaviors
- Changing preprocess functions
- Adding theme hooks or suggestions

**You should NOT modify files here when**:
- Adding entity fields → Use aegir-hosting
- Changing business logic → Use aegir-hosting
- Implementing Drush commands → Use aegir-provision
- Generating Apache configs → Use aegir-provision

## Integration Points

**This component receives**:
- Render arrays from hosting module entity view builders
- Variables from preprocess functions
- Custom theme hooks defined in hosting modules

**This component provides**:
- HTML output via Twig templates
- Styled UI via CSS
- Interactive behaviors via JavaScript

## Key Files

- `eldir.theme` - Preprocess functions, theme hooks
- `templates/page.html.twig` - Page layout
- `templates/hosting-*.html.twig` - Entity-specific templates
- `css/variables.css` - CSS custom properties
- `css/aegir.css` - Aegir-specific styles (BEM components)
- `js/eldir.js` - JavaScript behaviors

## Design System

- **CSS Variables**: `css/variables.css` for theming
- **BEM Methodology**: `.block__element--modifier` naming
- **Mobile-first**: Responsive design from small screens up
- **5 Breakpoints**: mobile (360px), tablet (768px), desktop (1024px), wide (1440px), ultra-wide (1920px)
- **WCAG AA**: Accessibility compliance

## Critical Principle

**Theme only presents data** - never contains business logic:
- ✅ Format dates for display
- ✅ Add CSS classes based on state
- ✅ Render entity data
- ❌ Calculate values
- ❌ Validate input
- ❌ Make API calls
- ❌ Database queries

---

**Need more context?** Read [AI-INSTRUCTIONS.md](AI-INSTRUCTIONS.md) for complete technical details.
