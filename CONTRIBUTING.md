# Contributing to WayruCO

Thank you for your interest in contributing to WayruCO! We welcome contributions from everyone, regardless of experience level. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### 1. Fork the Repository

```bash
# Using GitHub CLI
gh repo fork wayruco/wayruco --clone

# Or manually fork on GitHub and clone
git clone https://github.com/YOUR-USERNAME/wayruco.git
cd wayruco
git remote add upstream https://github.com/wayruco/wayruco.git
```

### 2. Create a Feature Branch

```bash
# Update your local main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Write clear, well-documented code
- Follow the project's code style
- Add tests for new functionality
- Update documentation as needed

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: Add new feature description"
```

### 5. Push and Create a Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
# Fill out the PR template with details about your changes
```

### 6. Respond to Feedback

- Address review comments
- Make requested changes
- Push updates to your branch
- Maintainers will merge when approved

## Contribution Guidelines

### Code Style

#### TypeScript
- Use TypeScript for type safety
- Avoid `any` types; use proper typing
- Write meaningful variable and function names
- Add JSDoc comments for public APIs

```typescript
/**
 * Categorizes a repository based on its metadata
 * @param metadata - Repository metadata
 * @returns The determined category
 */
export function categorizeRepository(metadata: RepositoryMetadata): RepositoryCategory {
  // Implementation
}
```

#### Formatting
- Use Prettier for code formatting
- Run `pnpm format` before committing
- Follow ESLint rules
- Run `pnpm lint` to check

#### File Organization
```
packages/example/
├── src/
│   ├── index.ts           # Main export
│   ├── types.ts           # Type definitions
│   ├── utils.ts           # Utility functions
│   └── __tests__/
│       ├── utils.test.ts
│       └── utils.property.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Dependency updates, build changes

**Examples:**
```
feat(manifest): Add repository categorization function
fix(serialization): Handle null values in manifest
docs(contributing): Update contribution guidelines
test(categorization): Add property-based tests
```

### Testing

#### Unit Tests
- Write tests for all new functions
- Test edge cases and error conditions
- Use descriptive test names

```typescript
describe('categorizeRepository', () => {
  it('should categorize smart contracts correctly', () => {
    const metadata = {
      name: 'token-contract',
      description: 'ERC-20 token',
      technologies: ['Solidity'],
    };
    expect(categorizeRepository(metadata)).toBe('contract');
  });
});
```

#### Property-Based Tests
- Use fast-check for property-based testing
- Test universal properties across many inputs
- Run minimum 100 iterations

```typescript
it('should deterministically categorize repositories', () => {
  fc.assert(
    fc.property(arbitraryRepositoryMetadata, (metadata) => {
      const category1 = categorizeRepository(metadata);
      const category2 = categorizeRepository(metadata);
      expect(category1).toBe(category2);
    }),
    { numRuns: 100 }
  );
});
```

#### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test categorization.test.ts

# Run with coverage
pnpm test --coverage
```

### Documentation

#### README Files
- Include clear project description
- Add installation instructions
- Provide usage examples
- Link to relevant documentation

#### Code Comments
- Explain "why", not "what"
- Use JSDoc for public APIs
- Keep comments up-to-date

#### Commit Messages
- Reference related issues: `Fixes #123`
- Explain the change and its impact
- Include breaking changes in footer

### Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add/update JSDoc comments
   - Update CHANGELOG.md

2. **Add Tests**
   - Write unit tests for new code
   - Add property-based tests for core logic
   - Ensure all tests pass

3. **Run Quality Checks**
   ```bash
   pnpm lint
   pnpm format
   pnpm type-check
   pnpm test
   ```

4. **Create PR with Template**
   - Describe changes clearly
   - Reference related issues
   - Include screenshots if applicable
   - List breaking changes

5. **Respond to Reviews**
   - Address all feedback
   - Ask questions if unclear
   - Push updates to same branch

6. **Merge**
   - Maintainers will merge when approved
   - Squash commits if requested
   - Delete branch after merge

## Areas for Contribution

### Code
- Bug fixes and improvements
- New features and functionality
- Performance optimizations
- Test coverage expansion

### Documentation
- Guides and tutorials
- API documentation
- Architecture diagrams
- Translation to other languages

### Community
- Bug reports and feature requests
- Code reviews and feedback
- Community support in discussions
- Event organization

### Design
- UI/UX improvements
- Visual design enhancements
- Accessibility improvements
- Animation and interactions

## Development Workflow

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests in watch mode
pnpm test --watch

# Run linter in watch mode
pnpm lint --watch
```

### Monorepo Commands

```bash
# Build all workspaces
pnpm build

# Build specific workspace
pnpm build --filter=@wayruco/manifest

# Run tests for specific workspace
pnpm test --filter=@wayruco/manifest

# Format all code
pnpm format

# Type check all workspaces
pnpm type-check
```

### Debugging

```bash
# Run with Node debugger
node --inspect-brk ./node_modules/.bin/vitest run

# Run specific test with debugging
pnpm test -- --inspect-brk categorization.test.ts
```

## Getting Help

- **Questions**: Ask in [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- **Bugs**: Report in [GitHub Issues](https://github.com/wayruco/wayruco/issues)
- **Security**: Email security@wayru.co
- **General**: Email hello@wayru.co

## Recognition

We recognize all contributors! Your contributions will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commit history
- Celebrated in community updates

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Additional Resources

- [Philosophy](./docs/mission/PHILOSOPHY.md) - Understand our mission
- [Vision](./docs/mission/VISION.md) - See where we're headed
- [Architecture](./docs/ARCHITECTURE.md) - Learn the system design
- [Development Guide](./docs/DEVELOPMENT.md) - Detailed setup instructions

---

Thank you for contributing to WayruCO! Together, we're building a more open and decentralized internet.
