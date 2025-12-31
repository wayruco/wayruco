# WayruCO Project Context

## Project Overview

**WayruCO** is an open-source monorepo hub that preserves and continues the Wayru Network mission of "freeing the internet as a human right." Following Wayru Inc.'s transition to open source, WayruCO serves as the central coordination point for building decentralized internet infrastructure.

### Mission
To democratize internet access by building open-source, community-driven infrastructure that empowers underserved communities with reliable, affordable, and censorship-resistant connectivity.

### Vision
A world where internet access is a fundamental human right, where communities own their digital infrastructure, and where technology serves people—not corporations.

## Project Structure

```
wayruco/
├── apps/                    # User-facing applications
│   └── landing/            # Community landing page (Next.js)
├── packages/               # Shared libraries and SDKs
│   ├── manifest/           # Repository manifest system
│   └── [other packages]
├── contracts/              # Smart contracts
├── docs/                   # Documentation
│   ├── mission/            # Philosophy, vision, history
│   ├── technical/          # Architecture and APIs
│   └── deployment/         # Deployment guides
├── scripts/                # Utility scripts
└── .kiro/                  # Agentic workflow configuration
    ├── steering/           # AI agent guidelines
    └── specs/              # Feature specifications
```

## Technology Stack

### Core Technologies
- **Framework**: Next.js 14.2.23 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui, Radix UI
- **Package Manager**: pnpm 8+
- **Build System**: Turbo
- **Testing**: Vitest, fast-check (property-based testing)

### Monorepo Tools
- **pnpm workspaces**: Dependency management
- **Turbo**: Build orchestration and caching
- **TypeScript**: Type safety across workspaces

### Infrastructure
- **Blockchain**: Solana for smart contracts
- **Hosting**: GitHub Pages, Vercel (optional)
- **CI/CD**: GitHub Actions

## Key Concepts

### Repository Manifest
A system for tracking and categorizing Wayru Network repositories:
- **Categories**: app, package, contract, tool
- **Priorities**: critical, important, nice-to-have
- **Status**: pending, forked, integrated, deprecated
- **Location**: `.wayruco/manifest.json`

### Workspace Organization
- **apps/**: User-facing applications (Next.js, React Native, etc.)
- **packages/**: Shared libraries, SDKs, utilities
- **contracts/**: Smart contracts (Solidity, Rust)
- **docs/**: Documentation and guides

### Build Pipeline
- **dev**: Start all apps in development mode
- **build**: Build all packages and apps
- **test**: Run all tests
- **lint**: Check code quality
- **format**: Format code with Prettier

## Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Format and lint
pnpm format
pnpm lint
```

### Creating a New Workspace
1. Create directory in appropriate location (apps/, packages/, or contracts/)
2. Add package.json with @wayruco/[name] naming
3. Update pnpm-workspace.yaml (if needed)
4. Update turbo.json with build pipeline
5. Add to .wayruco/manifest.json

### Contributing Code
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes following code standards
4. Write tests for new functionality
5. Commit with DCO sign-off: `git commit -s`
6. Push and create pull request
7. Address review feedback

## Code Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Write JSDoc comments for public APIs
- Use meaningful variable names

### File Organization
```
src/
├── index.ts           # Main export
├── types.ts           # Type definitions
├── utils.ts           # Utility functions
└── __tests__/
    ├── utils.test.ts
    └── utils.property.ts
```

### Testing
- Unit tests for all new functions
- Property-based tests for core logic
- Minimum 100 iterations for property tests
- Test edge cases and error conditions

### Commit Messages
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

## Important Files & Locations

### Documentation
- `README.md` - Project overview
- `CONTRIBUTING.md` - Contribution guidelines
- `CODE_OF_CONDUCT.md` - Community standards
- `ROADMAP.md` - Strategic milestones
- `docs/mission/PHILOSOPHY.md` - Core beliefs
- `docs/mission/VISION.md` - Long-term goals
- `docs/mission/HISTORY.md` - Project history

### Configuration
- `package.json` - Root package configuration
- `pnpm-workspace.yaml` - Workspace definitions
- `turbo.json` - Build pipeline configuration
- `tsconfig.base.json` - Shared TypeScript config
- `.wayruco/manifest.json` - Repository manifest

### Scripts
- `scripts/validate-dco.js` - DCO validation
- `scripts/bump-version.js` - Version management
- `scripts/update-changelog.js` - Changelog updates

## Governance & Community

### Decision Making
- **Minor**: Core team decides
- **Standard**: Core team with community input
- **Major**: Community Council votes
- **Critical**: Community Assembly votes

### Communication Channels
- GitHub Discussions: Long-form discussions
- GitHub Issues: Bug reports and features
- Discord: Real-time chat (future)
- Email: hello@wayru.co

### Roles
- **Contributor**: Made at least one contribution
- **Maintainer**: Demonstrated expertise and commitment
- **Core Team**: Strategic decisions and project direction
- **Council Member**: Elected community representative

## Quality Standards

### Code Quality
- ESLint: Enforce code style
- Prettier: Format code
- TypeScript: Type safety
- Tests: Unit and property-based

### Performance
- Optimize for low-bandwidth environments
- Minimize bundle sizes
- Cache build artifacts with Turbo
- Monitor performance metrics

### Security
- No hardcoded secrets
- Validate all inputs
- Use established cryptography libraries
- Report security issues to security@wayru.co

## Resources

### Documentation
- [Philosophy](../mission/PHILOSOPHY.md)
- [Vision](../mission/VISION.md)
- [History](../mission/HISTORY.md)
- [Contributing](../../CONTRIBUTING.md)
- [Governance](../community/GOVERNANCE.md)

### External Resources
- [Wayru Network](https://wayru.co)
- [GitHub Repository](https://github.com/wayruco/wayruco)
- [Solana Docs](https://docs.solana.com)
- [Next.js Docs](https://nextjs.org/docs)

## Contact & Support

- **Questions**: Ask in GitHub Discussions
- **Bugs**: Report in GitHub Issues
- **Security**: Email security@wayru.co
- **General**: Email hello@wayru.co

---

**Last Updated**: December 2025

This context document helps AI agents understand the project structure, standards, and workflow. It should be updated as the project evolves.
