# WayruCO Development Workflow Guide

## Overview

This guide describes the development workflow for contributing to WayruCO, from setup through deployment.

## Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/wayruco.git
cd wayruco

# Add upstream remote
git remote add upstream https://github.com/wayruco/wayruco.git
```

### 2. Install Dependencies

```bash
# Install pnpm if needed
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Verify Setup

```bash
# Run tests to verify everything works
pnpm test

# Check code quality
pnpm lint

# Type check
pnpm type-check
```

## Development Workflow

### 1. Create Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions**:
- `feature/add-new-feature` - New feature
- `fix/fix-bug-description` - Bug fix
- `docs/update-documentation` - Documentation
- `refactor/improve-code` - Code refactoring
- `test/add-tests` - Test additions

### 2. Make Changes

#### For New Features

```bash
# Create new workspace if needed
mkdir -p packages/new-package/src

# Create package.json
cat > packages/new-package/package.json << 'EOF'
{
  "name": "@wayruco/new-package",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx"
  }
}
EOF

# Create TypeScript config
cat > packages/new-package/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
EOF

# Start implementing
touch packages/new-package/src/index.ts
```

#### For Bug Fixes

```bash
# Locate the issue
grep -r "bug description" src/

# Create test that reproduces bug
# Fix the bug
# Verify test passes
```

#### For Documentation

```bash
# Edit relevant documentation files
# Preview changes locally
# Commit with clear message
```

### 3. Write Tests

#### Unit Tests

```typescript
// packages/example/src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

#### Property-Based Tests

```typescript
// packages/example/src/__tests__/utils.property.ts
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { myFunction } from '../utils';

describe('myFunction properties', () => {
  it('should satisfy property X', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const result = myFunction(input);
        expect(result).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});
```

### 4. Run Quality Checks

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test

# Run tests for specific workspace
pnpm test --filter=@wayruco/manifest

# Run tests in watch mode
pnpm test --watch
```

### 5. Commit Changes

```bash
# Stage changes
git add .

# Commit with DCO sign-off
git commit -s -m "feat(scope): Brief description

Longer explanation of the change and why it's needed.

Fixes #123"
```

**Commit message format**:
```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:
```
feat(manifest): Add repository categorization

Implement categorizeRepository function that determines
the appropriate workspace category based on repository
metadata including technology stack and purpose.

- Add categorization logic
- Add property-based tests
- Update documentation

Fixes #42
```

### 6. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
# Fill out PR template with:
# - Description of changes
# - Related issues
# - Testing performed
# - Screenshots (if applicable)
```

### 7. Address Review Feedback

```bash
# Make requested changes
# Commit with clear message
git commit -s -m "refactor: Address review feedback"

# Push updates
git push origin feature/your-feature-name

# Maintainers will merge when approved
```

## Testing Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test categorization.test.ts

# Run with coverage
pnpm test --coverage

# Run specific workspace tests
pnpm test --filter=@wayruco/manifest
```

### Test-Driven Development (TDD)

1. **Write failing test**
   ```bash
   pnpm test --watch
   ```

2. **Implement feature to pass test**
   ```typescript
   // Make test pass with minimal code
   ```

3. **Refactor**
   ```bash
   pnpm format
   pnpm lint --fix
   ```

4. **Repeat**

### Property-Based Testing Workflow

1. **Identify property to test**
   - What should always be true?
   - What invariants must hold?

2. **Create generator**
   ```typescript
   const arbitraryInput = fc.record({
     // Define input structure
   });
   ```

3. **Write property test**
   ```typescript
   fc.assert(
     fc.property(arbitraryInput, (input) => {
       // Assert property holds
     }),
     { numRuns: 100 }
   );
   ```

4. **Run and refine**
   ```bash
   pnpm test --watch
   ```

## Build Workflow

### Local Build

```bash
# Build all workspaces
pnpm build

# Build specific workspace
pnpm build --filter=@wayruco/landing

# Build with dependencies
pnpm build --filter=@wayruco/landing...

# Clean build
pnpm clean
pnpm build
```

### Incremental Build

```bash
# Only rebuild changed packages
pnpm build

# Turbo automatically detects changes
# Uses cache for unchanged packages
```

### Build Verification

```bash
# Verify build succeeds
pnpm build

# Verify no type errors
pnpm type-check

# Verify no lint errors
pnpm lint

# Verify tests pass
pnpm test
```

## Deployment Workflow

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] Code formatted
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped (if needed)
- [ ] PR reviewed and approved

### Deployment Steps

```bash
# 1. Update version
pnpm run version:patch  # or minor/major

# 2. Update changelog
pnpm run changelog

# 3. Build for production
pnpm build

# 4. Run final tests
pnpm test

# 5. Create release commit
git commit -s -m "chore: Release v1.0.0"

# 6. Tag release
git tag v1.0.0

# 7. Push to main
git push upstream main
git push upstream v1.0.0

# 8. Deploy (automated via CI/CD)
```

### Deployment Targets

**Apps**:
- Deployed to Vercel or GitHub Pages
- Automatic deployment on main branch

**Packages**:
- Published to npm
- Manual or automatic based on tags

**Contracts**:
- Deployed to Solana
- Requires governance approval

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build

# Check for circular dependencies
pnpm build --filter=@wayruco/manifest
```

#### Tests Fail

```bash
# Run specific test with verbose output
pnpm test -- --reporter=verbose

# Run in watch mode to debug
pnpm test --watch

# Check for flaky tests
pnpm test -- --repeat=10
```

#### Type Errors

```bash
# Check types
pnpm type-check

# Fix TypeScript errors
# Review tsconfig.json
# Check for missing types
```

#### Lint Errors

```bash
# Check lint errors
pnpm lint

# Auto-fix where possible
pnpm lint --fix

# Format code
pnpm format
```

### Getting Help

- **Questions**: Ask in GitHub Discussions
- **Bugs**: Report in GitHub Issues
- **Code Review**: Ask maintainers for guidance
- **Documentation**: Check docs/ directory

## Best Practices

### Code Review

- **Be respectful**: Assume good intent
- **Be specific**: Point to exact lines
- **Suggest improvements**: Don't just criticize
- **Approve when ready**: Don't block unnecessarily

### Commit Hygiene

- **Atomic commits**: One logical change per commit
- **Clear messages**: Explain what and why
- **DCO sign-off**: Always include
- **No secrets**: Never commit sensitive data

### Testing

- **Test first**: Write tests before code
- **Test edge cases**: Don't just test happy path
- **Property-based**: Test universal properties
- **Coverage**: Aim for high coverage

### Documentation

- **Update docs**: Keep documentation current
- **Add examples**: Show how to use new features
- **Comment code**: Explain non-obvious logic
- **Update CHANGELOG**: Record changes

## Workflow Checklist

Before submitting PR:
- [ ] Feature branch created
- [ ] Changes made and tested
- [ ] Tests written (unit + property-based)
- [ ] Code formatted (`pnpm format`)
- [ ] Linting passed (`pnpm lint`)
- [ ] Type checking passed (`pnpm type-check`)
- [ ] All tests pass (`pnpm test`)
- [ ] Commits have DCO sign-off
- [ ] Commit messages follow conventions
- [ ] Documentation updated
- [ ] PR description is clear
- [ ] Related issues referenced

## Resources

- [Contributing Guide](../../CONTRIBUTING.md)
- [Coding Standards](./coding-standards.md)
- [Architecture Guide](./architecture-guide.md)
- [Project Context](./project-context.md)

---

**Last Updated**: December 2025

This workflow guide helps maintain consistency and quality in the development process.
