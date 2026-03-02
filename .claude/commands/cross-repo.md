Implement a change that spans the aegir-eldir theme and other Aegir component repositories.

## Repository Map

| Repo | Local Path | Branch |
|------|-----------|--------|
| aegir-hostmaster (root) | `/var/aegir/drupal/aegir-2601/` | `dev/d11-new` |
| aegir-hosting (frontend) | `web/modules/contrib/aegir-hosting/` | `dev/d11-new` |
| aegir-provision (backend) | `vendor/argopecten/aegir-provision/` | `dev/d11-new` |
| **aegir-eldir (theme)** | `web/themes/contrib/aegir-eldir/` | `dev/d11-new` |

## Architecture Boundary (Critical)

| If you need to… | Work in |
|-----------------|---------|
| Add/modify templates, CSS, JS | **aegir-eldir** (here) |
| Add/modify Drupal entities, forms, services | aegir-hosting |
| Add/modify `provision:*` drush commands | aegir-provision |
| Add install/update scripts | aegir-hostmaster (root) |

**Forms NEVER call Provision directly**: Entity → Task (TaskManager) → Queue → Backend

## Cross-Repo Commit Workflow

```bash
# 1. Theme changes (this repo — already here)
cd /var/aegir/drupal/aegir-2601/web/themes/contrib/aegir-eldir
git add -p
git commit -m "feat(eldir): describe template/css/js change"

# 2. Hosting module changes (if needed)
cd /var/aegir/drupal/aegir-2601/web/modules/contrib/aegir-hosting
git add -p
git commit -m "feat(hosting): describe entity/form/service change"

# 3. Provision backend changes (if needed)
cd /var/aegir/drupal/aegir-2601/vendor/argopecten/aegir-provision
git add -p
git commit -m "feat(provision): describe drush command change"

# 4. Update submodule pointers in root repo
cd /var/aegir/drupal/aegir-2601
git add web/themes/contrib/aegir-eldir
git add web/modules/contrib/aegir-hosting        # if changed
git add vendor/argopecten/aegir-provision         # if changed
git commit -m "feat: describe cross-repo feature"
```

## Commit Message Convention

```
feat(eldir): add hosting-platform template and CSS
fix(eldir): correct sidebar breakpoint at 1024px
refactor(eldir): extract status badge to component
```

## After Cross-Repo Changes

```bash
drush cr
```

Implement the cross-repository changes, committing in each component repo first, then updating submodule pointers in the root repo.
