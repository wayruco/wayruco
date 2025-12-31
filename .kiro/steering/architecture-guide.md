# WayruCO Architecture Guide

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WayruCO Monorepo Hub                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Apps       │  │  Packages    │  │  Contracts   │       │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤       │
│  │ • landing    │  │ • manifest   │  │ • rewards    │       │
│  │ • explorer   │  │ • sdk        │  │ • staking    │       │
│  │ • portal     │  │ • config     │  │ • governance │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Shared Config  │                        │
│                    │  & Tooling      │                        │
│                    └────────────────┘                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Build System (Turbo + pnpm)                  │   │
│  │  • Dependency management                             │   │
│  │  • Build orchestration                               │   │
│  │  • Caching and optimization                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Workspace Organization

### Apps Layer

**Purpose**: User-facing applications

**Characteristics**:
- Deployed independently
- Have their own build output
- May have different tech stacks
- Depend on packages

**Examples**:
- `apps/landing` - Community landing page (Next.js)
- `apps/explorer-web` - Network explorer (React)
- `apps/mobile-app` - Mobile application (React Native)

**Structure**:
```
apps/example/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── pages/         # Page components
│   └── lib/           # Utilities
├── public/            # Static assets
├── package.json
├── next.config.js
└── tsconfig.json
```

### Packages Layer

**Purpose**: Shared libraries, SDKs, and utilities

**Characteristics**:
- Reusable across multiple apps
- Published to npm (optional)
- Versioned independently
- No UI (mostly)

**Examples**:
- `packages/manifest` - Repository manifest system
- `packages/sdk` - Core Wayru SDK
- `packages/config` - Shared configurations
- `packages/ui` - Shared UI components

**Structure**:
```
packages/example/
├── src/
│   ├── index.ts       # Main export
│   ├── types.ts       # Type definitions
│   ├── utils.ts       # Utilities
│   └── __tests__/     # Tests
├── package.json
├── tsconfig.json
└── README.md
```

### Contracts Layer

**Purpose**: Smart contracts for token economy and governance

**Characteristics**:
- Deployed to blockchain
- Immutable once deployed
- Versioned carefully
- Audited for security

**Examples**:
- `contracts/rewards-system-program` - Reward distribution
- `contracts/staking` - Node staking
- `contracts/governance` - DAO contracts

**Structure**:
```
contracts/example/
├── src/
│   ├── lib.rs         # Main contract code
│   └── state.rs       # State definitions
├── tests/
│   └── integration_tests.rs
├── Cargo.toml
└── README.md
```

## Dependency Management

### Workspace Dependencies

**Hoisting**: pnpm hoists common dependencies to root

```json
// Root package.json
{
  "dependencies": {
    "react": "^18",
    "typescript": "^5"
  }
}

// apps/landing/package.json
{
  "dependencies": {
    "@wayruco/manifest": "workspace:*"
  }
}
```

### Dependency Rules

1. **Apps** can depend on:
   - Packages
   - External libraries
   - Other apps (avoid circular)

2. **Packages** can depend on:
   - Other packages
   - External libraries
   - NOT apps

3. **Contracts** can depend on:
   - Other contracts
   - Blockchain libraries
   - NOT apps or packages

### Circular Dependency Prevention

```
✅ Good: Linear dependency chain
App → Package A → Package B → External

❌ Bad: Circular dependencies
App → Package A ↔ Package B
```

## Build Pipeline

### Turbo Configuration

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

### Build Order

1. **Dependencies first**: `^build` means build dependencies first
2. **Parallel execution**: Independent tasks run in parallel
3. **Caching**: Results cached for faster rebuilds
4. **Incremental**: Only rebuild changed packages

### Build Commands

```bash
# Build all
pnpm build

# Build specific workspace
pnpm build --filter=@wayruco/manifest

# Build with dependencies
pnpm build --filter=@wayruco/landing...

# Build dependents
pnpm build --filter=...@wayruco/manifest
```

## Data Flow

### Repository Manifest System

```
┌─────────────────────────────────────────┐
│  .wayruco/manifest.json                 │
│  (Repository metadata)                  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  packages/manifest/src/serialization.ts │
│  (Parse & validate)                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  packages/manifest/src/categorization.ts│
│  (Categorize repositories)              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Workspace organization                 │
│  (apps/, packages/, contracts/)         │
└─────────────────────────────────────────┘
```

## Module System

### Export Patterns

**Index-based exports** (recommended):
```typescript
// packages/manifest/src/index.ts
export * from './types';
export * from './serialization';
export * from './categorization';

// Usage
import { categorizeRepository, RepositoryManifest } from '@wayruco/manifest';
```

**Namespace imports**:
```typescript
// Usage
import * as manifest from '@wayruco/manifest';
const category = manifest.categorizeRepository(metadata);
```

### Path Aliases

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "paths": {
      "@wayruco/*": ["packages/*/src"],
      "@/*": ["./src/*"]
    }
  }
}
```

## Testing Architecture

### Test Organization

```
src/
├── __tests__/
│   ├── utils.test.ts          # Unit tests
│   ├── utils.property.ts      # Property-based tests
│   └── utils.integration.ts   # Integration tests
└── utils.ts
```

### Test Pyramid

```
        ▲
       ╱ ╲
      ╱   ╲  E2E Tests (few)
     ╱─────╲
    ╱       ╲
   ╱         ╲ Integration Tests (some)
  ╱───────────╲
 ╱             ╲
╱               ╲ Unit Tests (many)
╱─────────────────╲
```

### Property-Based Testing

```typescript
// Generate random inputs
const arbitraryMetadata = fc.record({
  name: fc.string(),
  description: fc.string(),
  technologies: fc.array(fc.string())
});

// Test property across many inputs
fc.assert(
  fc.property(arbitraryMetadata, (metadata) => {
    const result = categorizeRepository(metadata);
    expect(['app', 'package', 'contract', 'tool']).toContain(result);
  }),
  { numRuns: 100 }
);
```

## Configuration Management

### Shared Configurations

```
packages/config/
├── eslint-config/
│   └── index.js
├── prettier-config/
│   └── index.js
└── tsconfig/
    └── base.json
```

### Using Shared Configs

```json
// apps/landing/package.json
{
  "eslintConfig": {
    "extends": ["@wayruco/config/eslint"]
  }
}

// apps/landing/tsconfig.json
{
  "extends": "@wayruco/config/tsconfig/base"
}
```

## Error Handling Strategy

### Error Hierarchy

```
Error
├── ValidationError
│   ├── ManifestValidationError
│   └── RepositoryValidationError
├── SerializationError
│   ├── JSONParseError
│   └── JSONStringifyError
└── CategorizationError
```

### Error Propagation

```typescript
// Low level: Specific error
throw new ManifestValidationError('Invalid version format');

// Mid level: Wrap with context
try {
  deserializeManifest(json);
} catch (error) {
  throw new Error(`Failed to load manifest: ${error.message}`);
}

// High level: Handle gracefully
try {
  const manifest = loadManifest();
} catch (error) {
  logger.error('Manifest loading failed', error);
  // Use fallback or notify user
}
```

## Performance Optimization

### Build Optimization

1. **Caching**: Turbo caches build outputs
2. **Incremental**: Only rebuild changed packages
3. **Parallel**: Run independent tasks in parallel
4. **Pruning**: Only include necessary dependencies

### Runtime Optimization

1. **Tree-shaking**: Remove unused code
2. **Code-splitting**: Split large bundles
3. **Lazy-loading**: Load code on demand
4. **Memoization**: Cache expensive computations

## Security Architecture

### Dependency Security

1. **Lockfile**: Commit pnpm-lock.yaml
2. **Audit**: Run `pnpm audit` regularly
3. **Updates**: Keep dependencies current
4. **Scanning**: Use GitHub security scanning

### Code Security

1. **Input validation**: Validate all inputs
2. **Type safety**: Use TypeScript strict mode
3. **Secrets**: Use environment variables
4. **Audits**: Regular security reviews

## Scalability Considerations

### Monorepo Scaling

As the monorepo grows:

1. **Workspace count**: Organize into logical groups
2. **Build time**: Use Turbo caching and parallelization
3. **Dependencies**: Manage carefully to avoid bloat
4. **Documentation**: Keep architecture docs updated

### Future Considerations

- **Micro-frontends**: Split apps into smaller deployable units
- **Federated modules**: Share code at runtime
- **Polyrepo migration**: If monorepo becomes too large
- **Distributed builds**: Use remote caching

## Deployment Architecture

### Deployment Strategy

```
┌─────────────────────────────────────────┐
│  Source Code (GitHub)                   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  CI/CD Pipeline (GitHub Actions)        │
│  • Lint, test, build                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Artifact Registry                      │
│  • Docker images, npm packages          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Deployment Targets                     │
│  • Vercel (apps), npm (packages)        │
└─────────────────────────────────────────┘
```

## Documentation

- [Project Context](./project-context.md)
- [Coding Standards](./coding-standards.md)
- [Workflow Guide](./workflow-guide.md)

---

**Last Updated**: December 2025

This architecture guide helps maintain consistency and scalability as the project grows.
