Update theme documentation following the doc-to-wiki sync workflow.

## Rule: Edit `doc/` Only

The GitHub Wiki is auto-synced. **Never edit the wiki directly.**

- Edit docs in `doc/*.md` in this repo
- Sync is triggered by `.github/workflows/sync-wiki.yml` on `dev/d11-new` when `doc/*.md` changes

## Theme Documentation Files

| File | Content |
|------|---------|
| `doc/eldir-d11.md` | Main theme architecture and development guide |
| `doc/Home.md` | Project overview (wiki home page) |
| `doc/TODO.md` | Planned work (SDC migration, missing templates, etc.) |

## Workflow

1. Identify which doc file to update
2. Edit the file in `doc/` — never in the wiki UI
3. Commit the change to `dev/d11-new`
4. The sync workflow runs automatically on push

## Commit Convention for Doc Changes

```bash
git add doc/eldir-d11.md
git commit -m "docs(eldir): update template list with hosting-platform"
```

## What Belongs in Which File

- **Architecture changes** (new templates, new behaviors, new CSS files) → `doc/eldir-d11.md`
- **Project roadmap / known issues** → `doc/TODO.md`
- **Cross-component overview** → `doc/Home.md`

Read the relevant `doc/` file before editing to match existing style and structure.
