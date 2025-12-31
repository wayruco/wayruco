# Deployment Test Plan

## Overview

This document outlines the testing plan for the WayruCO GitHub Pages deployment workflow with the new monorepo structure.

## Workflows to Test

1. **nextjs.yml** - Deploy Next.js site to Pages (Monorepo)
2. **deploy-pages.yml** - Deploy to GitHub Pages
3. **release.yml** - Release workflow with GitHub Pages deployment

## Test Scenarios

### Scenario 1: Push to Main Branch (Continuous Deployment)

**Trigger**: Push to main branch with changes to `apps/landing/**`

**Expected Behavior**:
- `nextjs.yml` workflow triggers
- `deploy-pages.yml` workflow triggers
- Both workflows build the landing app
- Both workflows deploy to GitHub Pages
- Site updates at https://wayru.co

**Test Steps**:
1. Make a small change to `apps/landing/src/app/page.tsx`
2. Commit with DCO sign-off: `git commit -s -m "test: verify deployment workflow"`
3. Push to main: `git push origin main`
4. Monitor GitHub Actions:
   - Check `nextjs.yml` workflow status
   - Check `deploy-pages.yml` workflow status
5. Verify deployment:
   - Visit https://wayru.co
   - Check browser console for errors
   - Verify changes are live

**Success Criteria**:
- ✓ Both workflows complete successfully
- ✓ No build errors in logs
- ✓ Site deploys without errors
- ✓ Changes are visible on live site

### Scenario 2: Create Release Tag (Release Deployment)

**Trigger**: Push a release tag (e.g., `v1.1.2`)

**Expected Behavior**:
- `release.yml` workflow triggers
- Creates GitHub Release
- Publishes packages to npm (if NPM_TOKEN configured)
- Deploys to GitHub Pages
- `deploy-pages.yml` also triggers on tag push

**Test Steps**:
1. Create a release tag:
   ```bash
   npm run version:patch
   git push origin main
   git push origin v1.1.2
   ```
2. Monitor GitHub Actions:
   - Check `release.yml` workflow status
   - Check `deploy-pages.yml` workflow status
3. Verify GitHub Release:
   - Go to repository → Releases
   - Check release is created with correct version
   - Verify CHANGELOG.md is attached
4. Verify GitHub Pages deployment:
   - Visit https://wayru.co
   - Check version in browser console or page

**Success Criteria**:
- ✓ Release workflow completes successfully
- ✓ GitHub Release is created
- ✓ GitHub Pages deployment succeeds
- ✓ Site is updated with new version

### Scenario 3: Manual Workflow Dispatch

**Trigger**: Manual workflow dispatch from GitHub Actions UI

**Expected Behavior**:
- `deploy-pages.yml` can be triggered manually
- Builds and deploys landing app
- No changes required to code

**Test Steps**:
1. Go to repository → Actions
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch: main
5. Click "Run workflow"
6. Monitor workflow execution
7. Verify deployment

**Success Criteria**:
- ✓ Workflow triggers successfully
- ✓ Build completes without errors
- ✓ Deployment succeeds

### Scenario 4: Build Verification

**Trigger**: Any workflow build step

**Expected Behavior**:
- Landing app builds successfully
- Output directory contains index.html
- All assets are included
- No build errors or warnings

**Test Steps**:
1. Check workflow logs for build step
2. Verify output:
   ```
   Contents of apps/landing/out directory:
   ✓ index.html found
   ```
3. Check for CSS files
4. Check for JavaScript bundles

**Success Criteria**:
- ✓ index.html exists in output
- ✓ CSS files are present
- ✓ JavaScript bundles are present
- ✓ No build errors

## Local Testing

### Build Locally

```bash
# Install dependencies
npm install

# Build landing app for GitHub Pages
USE_REPO_PATH=false npm run build:landing

# Verify output
ls -la apps/landing/out/
cat apps/landing/out/index.html | head -20
```

### Serve Locally

```bash
# Install http-server
npm install -g http-server

# Serve the built app
cd apps/landing/out
http-server -p 8080

# Visit http://localhost:8080
```

### Test with Different Configurations

```bash
# Build for GitHub Pages with repository path
USE_REPO_PATH=true npm run build:landing

# Build for custom domain (default)
USE_REPO_PATH=false npm run build:landing
```

## Monitoring Checklist

### Before Deployment
- [ ] All tests pass locally
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build:landing`

### During Deployment
- [ ] GitHub Actions workflow runs
- [ ] Build step completes successfully
- [ ] Upload artifact step succeeds
- [ ] Deploy step completes without errors

### After Deployment
- [ ] Site is accessible at https://wayru.co
- [ ] Page loads without errors
- [ ] Browser console has no errors
- [ ] All assets load correctly
- [ ] Responsive design works on mobile
- [ ] Navigation works correctly

## Troubleshooting

### Build Fails

**Error**: `pnpm: not found`
- **Solution**: Ensure pnpm is installed in workflow
- **Check**: `.github/workflows/nextjs.yml` has `pnpm/action-setup@v2`

**Error**: `next build` fails
- **Solution**: Check for TypeScript errors
- **Check**: Run `npm run type-check` locally

**Error**: `index.html` not found in output
- **Solution**: Verify `next.config.js` has `output: 'export'`
- **Check**: Ensure `distDir: 'out'` is set

### Deployment Fails

**Error**: `Upload artifact failed`
- **Solution**: Verify artifact path is correct
- **Check**: Path should be `./apps/landing/out`

**Error**: `Deploy to GitHub Pages failed`
- **Solution**: Check GitHub Pages settings
- **Check**: Settings → Pages → Source should be "Deploy from a branch"

**Error**: Site not updating

- **Solution**: Clear browser cache
- **Check**: Wait 5-10 minutes for DNS propagation
- **Check**: Verify CNAME file exists in gh-pages branch

## Performance Metrics

### Build Time
- Target: < 2 minutes
- Monitor: GitHub Actions logs

### Deployment Time
- Target: < 1 minute
- Monitor: GitHub Actions logs

### Site Load Time
- Target: < 2 seconds
- Monitor: Browser DevTools

## Rollback Plan

If deployment fails or causes issues:

1. **Revert commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Revert tag**:
   ```bash
   git tag -d v1.1.2
   git push origin :refs/tags/v1.1.2
   ```

3. **Manual rollback**:
   - Go to repository → Settings → Pages
   - Check gh-pages branch history
   - GitHub Pages will serve the latest commit

## Success Criteria

All tests pass when:
- ✓ Continuous deployment works on main branch push
- ✓ Release deployment works on tag push
- ✓ Manual workflow dispatch works
- ✓ Build completes without errors
- ✓ Site deploys successfully
- ✓ Site is accessible and functional
- ✓ No errors in browser console
- ✓ All assets load correctly

## Next Steps

1. Execute Scenario 1: Push to main branch
2. Monitor workflow execution
3. Verify site deployment
4. Execute Scenario 2: Create release tag
5. Verify GitHub Release and deployment
6. Document any issues or improvements
7. Update this test plan as needed

---

**Last Updated**: December 31, 2025

This test plan ensures reliable deployment of the WayruCO landing page to GitHub Pages.
