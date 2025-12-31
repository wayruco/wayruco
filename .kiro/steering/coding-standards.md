# WayruCO Coding Standards

## Overview

This document defines the coding standards and conventions for WayruCO. All contributors should follow these guidelines to maintain consistency and quality across the codebase.

## TypeScript Standards

### General Rules
- Use TypeScript strict mode
- Avoid `any` types; use proper typing
- Use `unknown` instead of `any` when type is truly unknown
- Prefer interfaces over type aliases for object shapes
- Use const assertions for literal types

### Type Definitions

```typescript
// ✅ Good: Clear, specific types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Bad: Using any
interface User {
  id: any;
  name: any;
}

// ✅ Good: Union types for specific values
type Status = 'pending' | 'active' | 'inactive';

// ❌ Bad: String type is too broad
type Status = string;
```

### Function Signatures

```typescript
// ✅ Good: Clear parameter and return types
function categorizeRepository(
  metadata: RepositoryMetadata
): RepositoryCategory {
  // Implementation
}

// ✅ Good: Generic types for reusable functions
function parseJSON<T>(json: string): T {
  return JSON.parse(json);
}

// ❌ Bad: Missing return type
function categorizeRepository(metadata) {
  // Implementation
}
```

### JSDoc Comments

```typescript
/**
 * Categorizes a repository based on its metadata
 * 
 * @param metadata - Repository metadata containing name, description, and technologies
 * @returns The determined category: 'app', 'package', 'contract', or 'tool'
 * @throws Error if metadata is invalid
 * 
 * @example
 * const category = categorizeRepository({
 *   name: 'my-app',
 *   description: 'Web application',
 *   technologies: ['TypeScript', 'React']
 * });
 * // Returns: 'app'
 */
export function categorizeRepository(
  metadata: RepositoryMetadata
): RepositoryCategory {
  // Implementation
}
```

## File Organization

### Directory Structure
```
packages/example/
├── src/
│   ├── index.ts              # Main export
│   ├── types.ts              # Type definitions
│   ├── utils.ts              # Utility functions
│   ├── constants.ts          # Constants
│   ├── errors.ts             # Custom errors
│   └── __tests__/
│       ├── utils.test.ts     # Unit tests
│       └── utils.property.ts # Property-based tests
├── package.json
├── tsconfig.json
├── README.md
└── .eslintrc.json
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `user-service.ts` |
| Directories | kebab-case | `user-service/` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `IUserService` or `UserService` |
| Types | PascalCase | `UserStatus` |
| Functions | camelCase | `getUserById()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Variables | camelCase | `userName` |
| Private members | _camelCase | `_internalState` |

## Code Style

### Formatting
- Use Prettier for automatic formatting
- Line length: 100 characters (configurable)
- Indentation: 2 spaces
- Quotes: Single quotes for strings
- Semicolons: Always use

```typescript
// ✅ Good
const message: string = 'Hello, World!';
const numbers: number[] = [1, 2, 3];

// ❌ Bad
const message = "Hello, World!"
const numbers = [1, 2, 3]
```

### Imports
- Group imports: external, internal, types
- Sort alphabetically within groups
- Use absolute imports with path aliases

```typescript
// ✅ Good
import { readFile } from 'fs/promises';
import { z } from 'zod';

import { categorizeRepository } from './categorization';
import { validateManifest } from './serialization';

import type { Repository, RepositoryManifest } from './types';

// ❌ Bad
import type { Repository } from './types';
import { categorizeRepository } from './categorization';
import { z } from 'zod';
import { readFile } from 'fs/promises';
```

### Exports
- Use named exports for functions and types
- Use default export only for components or main entry points
- Re-export from index.ts for public API

```typescript
// ✅ Good: Named exports
export function categorizeRepository(metadata: RepositoryMetadata): RepositoryCategory {
  // Implementation
}

export interface RepositoryMetadata {
  // Definition
}

// In index.ts
export * from './categorization';
export * from './types';

// ❌ Bad: Default export for utility function
export default function categorizeRepository(metadata) {
  // Implementation
}
```

## Error Handling

### Custom Errors
```typescript
// ✅ Good: Custom error class
class ValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage
throw new ValidationError('Invalid email', 'email');

// ❌ Bad: Generic error
throw new Error('Invalid email');
```

### Error Handling
```typescript
// ✅ Good: Specific error handling
try {
  const manifest = deserializeManifest(json);
  return manifest;
} catch (error) {
  if (error instanceof SyntaxError) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
  if (error instanceof ValidationError) {
    throw new Error(`Validation failed: ${error.message}`);
  }
  throw error;
}

// ❌ Bad: Swallowing errors
try {
  const manifest = deserializeManifest(json);
} catch (error) {
  console.log('Error occurred');
}
```

## Testing Standards

### Unit Tests
```typescript
// ✅ Good: Clear test structure
describe('categorizeRepository', () => {
  it('should categorize smart contracts correctly', () => {
    const metadata = {
      name: 'token-contract',
      description: 'ERC-20 token',
      technologies: ['Solidity'],
    };
    
    const result = categorizeRepository(metadata);
    
    expect(result).toBe('contract');
  });

  it('should throw error for invalid metadata', () => {
    expect(() => {
      categorizeRepository({} as RepositoryMetadata);
    }).toThrow();
  });
});

// ❌ Bad: Unclear test
it('works', () => {
  const result = categorizeRepository(someData);
  expect(result).toBeDefined();
});
```

### Property-Based Tests
```typescript
// ✅ Good: Property-based test with clear property
it('should deterministically categorize repositories', () => {
  fc.assert(
    fc.property(arbitraryRepositoryMetadata, (metadata) => {
      const category1 = categorizeRepository(metadata);
      const category2 = categorizeRepository(metadata);
      
      // Property: Same input always produces same output
      expect(category1).toBe(category2);
    }),
    { numRuns: 100 }
  );
});
```

### Test File Naming
- Unit tests: `*.test.ts`
- Property-based tests: `*.property.ts`
- Integration tests: `*.integration.ts`
- E2E tests: `*.e2e.ts`

## Comments & Documentation

### When to Comment
- Explain "why", not "what"
- Document non-obvious logic
- Explain business rules
- Note performance considerations

```typescript
// ✅ Good: Explains why
// We use a Set for O(1) lookup performance
const seenIds = new Set<string>();

// ❌ Bad: Explains what (code already shows this)
// Add id to set
seenIds.add(id);
```

### Comment Style
```typescript
// Single line comment for brief notes
// Use for explaining specific lines

/**
 * Multi-line comment for complex explanations
 * Use for functions, classes, and complex logic
 */

// TODO: Implement feature X
// FIXME: Fix bug in Y
// NOTE: Important consideration about Z
```

## Performance Considerations

### Optimization Guidelines
- Avoid unnecessary re-renders in React components
- Use memoization for expensive computations
- Prefer const over let when possible
- Use early returns to reduce nesting

```typescript
// ✅ Good: Early return reduces nesting
function processUser(user: User): void {
  if (!user.isActive) {
    return;
  }
  
  // Process active user
}

// ❌ Bad: Unnecessary nesting
function processUser(user: User): void {
  if (user.isActive) {
    // Process active user
  }
}
```

## Security Best Practices

### Input Validation
```typescript
// ✅ Good: Validate all inputs
function processUserInput(input: unknown): User {
  const validated = UserSchema.parse(input);
  return validated;
}

// ❌ Bad: Trust user input
function processUserInput(input: any): User {
  return input as User;
}
```

### Secrets Management
- Never hardcode secrets
- Use environment variables
- Don't log sensitive information
- Rotate secrets regularly

```typescript
// ✅ Good: Use environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}

// ❌ Bad: Hardcoded secret
const apiKey = 'sk_live_abc123xyz';
```

## Accessibility Standards

### React Components
- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

```typescript
// ✅ Good: Semantic HTML with ARIA
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  ✕
</button>

// ❌ Bad: Non-semantic with no label
<div onClick={onClose}>✕</div>
```

## Git Workflow

### Commit Messages
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

Fixes #123
```

### DCO Sign-off
All commits must include a Developer Certificate of Origin sign-off:

```bash
git commit -s -m "feat: Add new feature"
```

This adds: `Signed-off-by: Your Name <your.email@example.com>`

## Tools & Configuration

### ESLint
- Configuration: `.eslintrc.json`
- Run: `pnpm lint`
- Fix: `pnpm lint --fix`

### Prettier
- Configuration: `.prettierrc`
- Run: `pnpm format`

### TypeScript
- Configuration: `tsconfig.base.json`
- Check: `pnpm type-check`

### Tests
- Framework: Vitest
- Run: `pnpm test`
- Watch: `pnpm test --watch`
- Coverage: `pnpm test --coverage`

## Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code follows TypeScript standards
- [ ] Functions have JSDoc comments
- [ ] Tests are included (unit and property-based)
- [ ] All tests pass
- [ ] Code is formatted with Prettier
- [ ] No ESLint errors
- [ ] No hardcoded secrets
- [ ] Commit messages follow conventions
- [ ] DCO sign-off included
- [ ] Documentation updated

## Questions & Clarifications

If you're unsure about a standard:
1. Check existing code for examples
2. Ask in GitHub Discussions
3. Consult with maintainers
4. Update this document if needed

---

**Last Updated**: December 2025

These standards help maintain code quality and consistency. They evolve as the project grows.
