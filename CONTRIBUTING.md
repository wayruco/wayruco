# Contributing to WayruCo

Thank you for your interest in contributing to WayruCo! We welcome contributions from everyone and appreciate your help in making this project better.

## 🚀 Getting Started

### Prerequisites
- Node.js 22.18.0+
- npm or yarn
- Git
- Basic knowledge of React/TypeScript (for code contributions)

### Setup Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/wayruco.git
cd wayruco

# Add upstream remote
git remote add upstream https://github.com/wayruco/wayruco.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Types of Contributions

### 🐛 Bug Reports
Found a bug? Help us fix it!

1. Check [existing issues](https://github.com/wayruco/wayruco/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (OS, browser, Node version)

### ✨ Feature Requests
Have an idea? We'd love to hear it!

1. Check [discussions](https://github.com/wayruco/wayruco/discussions)
2. Create a discussion or issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant mockups or examples

### 📝 Documentation
Help us improve documentation!

- Fix typos and clarify explanations
- Add examples and tutorials
- Translate documentation
- Improve code comments

### 💻 Code Contributions
Ready to code? Follow these steps:

1. **Find an Issue**
   - Look for issues labeled `good first issue` or `help wanted`
   - Comment to express interest
   - Wait for assignment

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Changes**
   - Write clean, readable code
   - Follow the code style guide
   - Add comments for complex logic
   - Update related documentation

4. **Test Your Changes**
   ```bash
   npm run build
   npm run dev
   # Test manually in browser
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Wait for review

## 📐 Code Style Guide

### TypeScript/React
- Use TypeScript for type safety
- Follow ESLint configuration
- Use functional components with hooks
- Write meaningful variable names
- Add JSDoc comments for functions

```typescript
/**
 * Calculates the progress to the next milestone
 * @returns Progress value from 0 to 1
 */
function getProgressToNextMilestone(): number {
  // Implementation
}
```

### Formatting
- Use Prettier for code formatting
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters

### CSS/Tailwind
- Use Tailwind CSS classes
- Avoid inline styles
- Use semantic class names
- Follow mobile-first approach

## 🔄 Git Workflow

### Commit Messages
Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Build, dependencies, etc.

**Examples:**
```
feat(timeline): Add milestone filtering
fix(audio): Fix sound toggle not working
docs(readme): Update installation instructions
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Writing Tests
- Write tests for new features
- Aim for >80% code coverage
- Use descriptive test names
- Test edge cases

## 📦 Pull Request Process

### Before Submitting
- [ ] Code follows style guide
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Commits are clean and descriptive

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Breaking change

## Related Issues
Closes #123

## Testing
How to test these changes

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process
1. Maintainers review your PR
2. Address feedback and suggestions
3. Make requested changes
4. Re-request review
5. Merge when approved

## 🎯 Development Guidelines

### Performance
- Minimize bundle size
- Optimize animations (60 FPS)
- Lazy load components
- Cache appropriately

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Support keyboard navigation
- Test with screen readers

### Security
- Sanitize user input
- Avoid hardcoding secrets
- Use HTTPS for external resources
- Keep dependencies updated

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🆘 Getting Help

- 💬 [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- 🐛 [GitHub Issues](https://github.com/wayruco/wayruco/issues)
- 📧 Email: hello@wayru.co
- 📖 [Documentation](./docs)

## 📋 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment.

## 🙏 Thank You!

Your contributions make WayruCo better. Thank you for being part of our community!

---

**Happy coding! 🚀**
