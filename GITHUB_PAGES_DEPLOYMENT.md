# GitHub Pages Deployment Guide

## Overview

The WayruCO landing page is automatically deployed to GitHub Pages on every push to the `main` branch. This guide explains the deployment workflow and how to manage it.

## Automatic Deployment

### Workflow: `deploy-pages.yml`

The GitHub Pages deployment is triggered automatically when:
- Code is pushed to the `main` branch
- A release tag is pushed (e.g., `v1.1.0`)
- Changes are made to `apps/landing/**` or `.github/workflows/deploy-pages.yml`
- Manual workflow dispatch is triggered

### Release Workflow: `release.yml`

The release workflow is triggered when a tag is pushed and includes:
1. **Create Release**: Creates a GitHub Release with CHANGELOG and LICENSE
2. **Publish Packages**: Publishes packages to npm (requires `NPM_TOKEN` secret)
3. **Deploy to GitHub Pages**: Automatically deploys the landing page to GitHub Pages

### Deployment Process

1. **Build**: Next.js builds the landing page with static export (`output: 'export'`)
2. **Upload**: Build artifacts are uploaded to GitHub Pages
3. **Deploy**: GitHub Pages serves the static site

## Configuration

### GitHub Pages Settings

1. Go to repository Settings → Pages
2. Set Source to: **Deploy from a branch**
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**

### Custom Domain (wayru.co)

1. Go to repository Settings → Pages
2. Under "Custom domain", enter: `wayru.co`
3. GitHub automatically creates a `CNAME` file in the `gh-pages` branch
4. Update DNS records to point to GitHub Pages:
   - Add `A` record pointing to GitHub Pages IP
   - Or add `CNAME` record pointing to `wayruco.github.io`

### Environment Variables

The deployment uses these environment variables:
- `USE_REPO_PATH=true` - Enables GitHub Pages path configuration
- `GITHUB_ACTIONS=true` - Automatically set by GitHub Actions

## Version Management

### Bumping Version

```bash
# Bump minor version (e.g., 1.0.0 → 1.1.0)
npm run version:minor

# Bump patch version (e.g., 1.0.0 → 1.0.1)
npm run version:patch

# Bump major version (e.g., 1.0.0 → 2.0.0)
npm run version:major
```

### Creating Release Tags

```bash
# Create a release tag and push to GitHub
npm run version:release
```

This will:
1. Bump the version
2. Update CHANGELOG.md
3. Create a git tag (e.g., `v1.1.0`)
4. Push to GitHub
5. Trigger the release workflow

### Release Workflow Process

When you push a tag (e.g., `git push origin v1.1.0`), the release workflow automatically:

1. **Create Release Job**:
   - Checks out code
   - Installs dependencies
   - Builds all packages
   - Runs all tests
   - Creates a GitHub Release with CHANGELOG and LICENSE

2. **Publish Packages Job** (requires `NPM_TOKEN` secret):
   - Builds all packages in `packages/` directory
   - Publishes to npm with public access
   - Requires npm authentication token

3. **Deploy to GitHub Pages Job**:
   - Builds the landing app with GitHub Pages configuration
   - Uploads build artifacts
   - Deploys to GitHub Pages
   - Updates the live site at wayru.co

### Monitoring Release Deployments

1. Go to repository → Actions
2. Select "Release" workflow
3. View deployment status and logs
4. Check GitHub Pages deployment status
5. Verify npm package publication (if applicable)

## Monitoring Deployments

### GitHub Actions

1. Go to repository → Actions
2. Select "Deploy to GitHub Pages" workflow
3. View deployment status and logs

### Deployment Status

- **Success**: Green checkmark, site is live
- **Failure**: Red X, check logs for errors
- **In Progress**: Yellow dot, deployment is running

## Troubleshooting

### Build Fails

Check the GitHub Actions logs:
1. Go to Actions → Deploy to GitHub Pages
2. Click the failed workflow run
3. Expand "Build Landing Page" step
4. Review error messages

Common issues:
- Missing dependencies: Run `npm install`
- TypeScript errors: Run `npm run type-check`
- Build errors: Run `npm run build:landing` locally

### Site Not Updating

1. Clear browser cache (Ctrl+Shift+Delete)
2. Check GitHub Pages settings
3. Verify CNAME file exists in `gh-pages` branch
4. Wait 5-10 minutes for DNS propagation

### Custom Domain Not Working

1. Verify DNS records are configured correctly
2. Check CNAME file in `gh-pages` branch
3. Wait for DNS propagation (can take up to 48 hours)
4. Test with: `nslookup wayru.co`

## Local Testing

### Build for GitHub Pages

```bash
# Build with GitHub Pages configuration
USE_REPO_PATH=true npm run build:landing

# Serve locally
cd apps/landing
npx http-server out
```

### Preview Deployment

```bash
# Start dev server
npm run dev:landing

# Visit http://localhost:3001
```

## Performance Optimization

### Image Optimization

- Images are unoptimized for static export
- Use responsive images with `srcSet`
- Compress images before committing

### Bundle Size

- Monitor bundle size in GitHub Actions logs
- Use dynamic imports for large components
- Tree-shake unused dependencies

## Security

### Secrets Management

GitHub Pages deployment uses these secrets (if configured):
- `VERCEL_TOKEN` - For Vercel deployments (optional)
- `VERCEL_ORG_ID` - For Vercel deployments (optional)
- `VERCEL_PROJECT_ID` - For Vercel deployments (optional)

### CNAME File

The CNAME file is automatically managed by GitHub Pages. Do not manually edit it.

## Rollback

### Revert to Previous Version

```bash
# View recent commits
git log --oneline -10

# Revert to previous commit
git revert <commit-hash>

# Push to trigger redeployment
git push origin main
```

### Manual Rollback

1. Go to repository → Settings → Pages
2. Check "gh-pages" branch history
3. GitHub Pages will serve the latest commit

## Next Steps

- Monitor deployment status in GitHub Actions
- Test the live site at https://wayru.co
- Report any issues in GitHub Issues
- Update this guide as needed

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
