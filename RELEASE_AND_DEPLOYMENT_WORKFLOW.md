# Release and Deployment Workflow

## Overview

The WayruCO project now has a complete, automated release and deployment workflow that handles version management, GitHub releases, npm package publishing, and GitHub Pages deployment.

## Workflow Architecture

### 1. Version Bumping (Local)

```bash
# Bump version and create tag
npm run version:minor    # 1.0.0 → 1.1.0
npm run version:patch    # 1.0.0 → 1.0.1
npm run version:major    # 1.0.0 → 2.0.0

# This automatically:
# - Updates version.json
# - Updates CHANGELOG.md
# - Creates git commit with DCO sign-off
# - Creates git tag (e.g., v1.1.0)
```

### 2. Push to GitHub

```bash
# Push commits and tags
git push origin main
git push origin v1.1.0
```

### 3. Automated Release Workflow

When a tag is pushed (e.g., `v1.1.0`), the `.github/workflows/release.yml` workflow is triggered:

#### Job 1: Create Release
- Checks out code with full history
- Installs dependencies
- Builds all packages
- Runs all tests
- Creates GitHub Release with:
  - CHANGELOG.md
  - LICENSE
  - Release notes with installation and deployment instructions

#### Job 2: Publish Packages (Optional)
- Requires `NPM_TOKEN` secret configured
- Builds all packages in `packages/` directory
- Publishes to npm with public access
- Depends on: Create Release job

#### Job 3: Deploy to GitHub Pages
- Builds landing app with GitHub Pages configuration
- Uploads build artifacts
- Deploys to GitHub Pages
- Updates live site at wayru.co
- Depends on: Create Release job

### 4. Continuous Deployment (Main Branch)

The `.github/workflows/deploy-pages.yml` workflow also triggers on:
- Push to `main` branch
- Changes to `apps/landing/**`
- Manual workflow dispatch

This allows for continuous deployment of the landing page without requiring a release tag.

## Workflow Triggers

### Deploy to GitHub Pages Workflow

Triggers on:
1. **Main branch push** - Continuous deployment
2. **Tag push** (v*) - Release deployment
3. **Landing app changes** - Automatic updates
4. **Workflow file changes** - Testing workflow updates
5. **Manual dispatch** - On-demand deployment

### Release Workflow

Triggers on:
1. **Tag push** (v*) - Automatic release creation and deployment

## Configuration

### Required Secrets

For full functionality, configure these GitHub secrets:

1. **NPM_TOKEN** (Optional)
   - Required for npm package publishing
   - Get from https://www.npmjs.com/settings/~/tokens
   - Scope: Automation

2. **VERCEL_TOKEN** (Optional)
   - For Vercel deployments (if using Vercel)
   - Get from Vercel dashboard

3. **VERCEL_ORG_ID** (Optional)
   - Vercel organization ID

4. **VERCEL_PROJECT_ID** (Optional)
   - Vercel project ID

### GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Set Source to: **Deploy from a branch**
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**

### Custom Domain

1. Go to repository Settings → Pages
2. Under "Custom domain", enter: `wayru.co`
3. Update DNS records to point to GitHub Pages

## Release Process

### Step-by-Step

1. **Make changes** to the codebase
2. **Test locally**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```
3. **Bump version**
   ```bash
   npm run version:minor
   ```
4. **Review changes**
   ```bash
   git log --oneline -5
   git show HEAD
   ```
5. **Push to GitHub**
   ```bash
   git push origin main
   git push origin v1.1.0
   ```
6. **Monitor release**
   - Go to Actions → Release workflow
   - Watch build, test, and deployment steps
   - Verify GitHub Release is created
   - Check GitHub Pages deployment

### Monitoring

1. **GitHub Actions**
   - Go to repository → Actions
   - Select "Release" workflow
   - View job status and logs

2. **GitHub Releases**
   - Go to repository → Releases
   - Verify release is created with correct version
   - Check release notes and attached files

3. **GitHub Pages**
   - Visit https://wayru.co
   - Verify latest version is deployed
   - Check browser console for errors

4. **npm Registry** (if publishing)
   - Visit https://www.npmjs.com/package/@wayruco/[package-name]
   - Verify latest version is published

## Troubleshooting

### Release Workflow Fails

1. Check GitHub Actions logs
2. Verify all tests pass locally
3. Check for TypeScript errors: `npm run type-check`
4. Check for lint errors: `npm run lint`
5. Verify dependencies are installed: `npm install`

### GitHub Pages Not Updating

1. Clear browser cache
2. Check GitHub Pages settings
3. Verify CNAME file exists in gh-pages branch
4. Wait 5-10 minutes for DNS propagation
5. Check GitHub Actions logs for build errors

### npm Publishing Fails

1. Verify NPM_TOKEN secret is configured
2. Check npm registry for conflicts
3. Verify package.json has correct name and version
4. Check npm publish permissions

## Best Practices

1. **Always test before releasing**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

2. **Use semantic versioning**
   - MAJOR: Breaking changes
   - MINOR: New features (backwards compatible)
   - PATCH: Bug fixes

3. **Write clear commit messages**
   - Use conventional commits
   - Include DCO sign-off: `git commit -s`

4. **Update CHANGELOG**
   - Automatically done by version bump script
   - Review for accuracy

5. **Monitor deployments**
   - Check GitHub Actions logs
   - Verify live site updates
   - Test functionality after deployment

## Files Modified

- `.github/workflows/release.yml` - Added GitHub Pages deployment job
- `.github/workflows/deploy-pages.yml` - Added tag trigger
- `GITHUB_PAGES_DEPLOYMENT.md` - Updated with release workflow documentation
- `MOBILE_FIRST_LANDING_SUMMARY.md` - Updated with complete workflow information

## Next Steps

1. Configure GitHub secrets (NPM_TOKEN if publishing packages)
2. Test release workflow with a patch version bump
3. Monitor first release deployment
4. Document any additional deployment requirements
5. Set up monitoring and alerting for failed deployments

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated**: December 31, 2025

This workflow ensures reliable, automated releases and deployments for the WayruCO project.
