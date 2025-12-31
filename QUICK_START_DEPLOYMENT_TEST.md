# Quick Start: Deployment Test Guide

## Overview

This guide provides quick commands to test the deployment workflows. Follow these steps to verify everything is working correctly.

## Prerequisites

- Git configured with DCO sign-off
- GitHub repository access
- Local development environment set up

## Test 1: Verify Local Build (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Landing App
```bash
npm run build:landing
```

### Step 3: Verify Output
```bash
ls -la apps/landing/out/
cat apps/landing/out/index.html | head -20
```

**Expected Output**:
```
✓ index.html exists
✓ _next/ directory exists
✓ CSS files present
✓ JavaScript bundles present
```

## Test 2: Push to Main Branch (10 minutes)

### Step 1: Make a Test Change
```bash
echo "// test deployment" >> apps/landing/src/app/page.tsx
```

### Step 2: Commit with DCO Sign-off
```bash
git add apps/landing/src/app/page.tsx
git commit -s -m "test: verify deployment workflow"
```

### Step 3: Push to Main
```bash
git push origin main
```

### Step 4: Monitor GitHub Actions
1. Go to: https://github.com/wayruco/wayruco/actions
2. Watch for workflows:
   - `Deploy Next.js site to Pages (Monorepo)` (nextjs.yml)
   - `Deploy to GitHub Pages` (deploy-pages.yml)
3. Wait for both to complete (should take 2-3 minutes)

### Step 5: Verify Deployment
1. Visit: https://wayru.co
2. Check browser console (F12) for errors
3. Verify page loads correctly
4. Check that your test comment is in the page source

**Success Indicators**:
- ✓ Both workflows show green checkmarks
- ✓ Site loads without errors
- ✓ No console errors
- ✓ Page is responsive

## Test 3: Create Release Tag (15 minutes)

### Step 1: Bump Version
```bash
npm run version:patch
```

This will:
- Update version.json
- Update CHANGELOG.md
- Create a git commit
- Create a git tag

### Step 2: View Changes
```bash
git log --oneline -3
git show HEAD
```

### Step 3: Push Commits and Tags
```bash
git push origin main
git push origin v1.1.2
```

### Step 4: Monitor GitHub Actions
1. Go to: https://github.com/wayruco/wayruco/actions
2. Watch for workflows:
   - `Release` (release.yml)
   - `Deploy to GitHub Pages` (deploy-pages.yml)
3. Wait for all jobs to complete (should take 3-5 minutes)

### Step 5: Verify Release
1. Go to: https://github.com/wayruco/wayruco/releases
2. Check that new release is created
3. Verify CHANGELOG.md is attached
4. Verify release notes are present

### Step 6: Verify Deployment
1. Visit: https://wayru.co
2. Check that site is updated
3. Verify no errors in console

**Success Indicators**:
- ✓ Release workflow shows green checkmark
- ✓ GitHub Release is created
- ✓ CHANGELOG.md is attached
- ✓ Site deploys successfully
- ✓ No console errors

## Test 4: Manual Workflow Dispatch (5 minutes)

### Step 1: Go to GitHub Actions
1. Visit: https://github.com/wayruco/wayruco/actions
2. Click on "Deploy to GitHub Pages" workflow

### Step 2: Run Workflow
1. Click "Run workflow" button
2. Select branch: main
3. Click "Run workflow" button

### Step 3: Monitor Execution
1. Watch workflow execution
2. Wait for build and deploy jobs to complete

### Step 4: Verify Deployment
1. Visit: https://wayru.co
2. Verify site loads correctly
3. Check console for errors

**Success Indicators**:
- ✓ Workflow runs successfully
- ✓ Build completes without errors
- ✓ Deployment succeeds
- ✓ Site is accessible

## Troubleshooting Quick Reference

### Build Fails

**Error**: `pnpm: not found`
```bash
# Check workflow file
cat .github/workflows/nextjs.yml | grep -A 2 "pnpm/action-setup"
```

**Error**: `next build` fails
```bash
# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint
```

**Error**: `index.html` not found
```bash
# Verify build output
ls -la apps/landing/out/
```

### Deployment Fails

**Error**: `Upload artifact failed`
```bash
# Check artifact path in workflow
cat .github/workflows/nextjs.yml | grep "path:"
```

**Error**: `Deploy to GitHub Pages failed`
```bash
# Check GitHub Pages settings
# Go to: Settings → Pages
# Verify: Source is "Deploy from a branch"
# Verify: Branch is "gh-pages"
```

### Site Not Updating

```bash
# Clear browser cache
# Ctrl+Shift+Delete (Windows/Linux)
# Cmd+Shift+Delete (Mac)

# Wait 5-10 minutes for DNS propagation

# Check CNAME file
# Go to: gh-pages branch
# Verify: CNAME file exists with "wayru.co"
```

## Monitoring Checklist

### Before Each Test
- [ ] All local tests pass: `npm run test`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build:landing`

### During Workflow Execution
- [ ] GitHub Actions shows workflow running
- [ ] Build step completes successfully
- [ ] Upload artifact step succeeds
- [ ] Deploy step completes without errors

### After Deployment
- [ ] Site is accessible at https://wayru.co
- [ ] Page loads without errors
- [ ] Browser console has no errors
- [ ] All assets load correctly
- [ ] Responsive design works on mobile

## Performance Benchmarks

### Build Time
- **Target**: < 2 minutes
- **Acceptable**: < 3 minutes
- **Check**: GitHub Actions logs

### Deployment Time
- **Target**: < 1 minute
- **Acceptable**: < 2 minutes
- **Check**: GitHub Actions logs

### Site Load Time
- **Target**: < 2 seconds
- **Acceptable**: < 3 seconds
- **Check**: Browser DevTools Network tab

## Quick Commands Reference

```bash
# Build locally
npm run build:landing

# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test

# Version bump
npm run version:patch
npm run version:minor
npm run version:major

# View version
npm run version

# View git log
git log --oneline -5

# View git status
git status

# Push to GitHub
git push origin main
git push origin v1.1.2
```

## Workflow Status URLs

### GitHub Actions
- All workflows: https://github.com/wayruco/wayruco/actions
- nextjs.yml: https://github.com/wayruco/wayruco/actions/workflows/nextjs.yml
- deploy-pages.yml: https://github.com/wayruco/wayruco/actions/workflows/deploy-pages.yml
- release.yml: https://github.com/wayruco/wayruco/actions/workflows/release.yml
- ci.yml: https://github.com/wayruco/wayruco/actions/workflows/ci.yml

### GitHub Pages
- Releases: https://github.com/wayruco/wayruco/releases
- Pages Settings: https://github.com/wayruco/wayruco/settings/pages
- Live Site: https://wayru.co

## Success Criteria Summary

### Test 1: Local Build
- ✓ Build completes without errors
- ✓ index.html exists in output
- ✓ All assets are present

### Test 2: Push to Main
- ✓ Both workflows complete successfully
- ✓ Site deploys without errors
- ✓ Changes are visible on live site

### Test 3: Create Release
- ✓ Release workflow completes successfully
- ✓ GitHub Release is created
- ✓ Site deploys successfully

### Test 4: Manual Dispatch
- ✓ Workflow runs successfully
- ✓ Build completes without errors
- ✓ Site deploys successfully

## Next Steps After Testing

1. **Document Results**
   - Note any issues encountered
   - Document solutions applied
   - Update troubleshooting guide

2. **Optimize Performance**
   - Monitor build times
   - Optimize caching if needed
   - Improve workflow efficiency

3. **Configure Secrets** (if needed)
   - Add NPM_TOKEN for package publishing
   - Add Vercel secrets if using Vercel

4. **Set Up Monitoring**
   - Monitor deployment frequency
   - Track build times
   - Monitor site performance

5. **Continuous Improvement**
   - Review workflow logs regularly
   - Optimize as needed
   - Keep documentation updated

## Support & Resources

### Documentation
- [DEPLOYMENT_COMPLETE_SUMMARY.md](./DEPLOYMENT_COMPLETE_SUMMARY.md)
- [WORKFLOW_UPDATES_SUMMARY.md](./WORKFLOW_UPDATES_SUMMARY.md)
- [DEPLOYMENT_TEST_PLAN.md](./DEPLOYMENT_TEST_PLAN.md)
- [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)

### External Resources
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated**: December 31, 2025

**Quick Start Time**: ~30 minutes for all tests

**Status**: ✅ READY TO TEST

Follow these steps to verify the deployment infrastructure is working correctly.
