# WayruCO: The Open Internet Initiative

> **Decentralized connectivity for everyone. Open source. Community-driven. Forever.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-brightgreen)

---

## 🌍 Mission & Vision

### Our Mission
To democratize internet access by building open-source, community-driven infrastructure that empowers underserved communities with reliable, affordable, and censorship-resistant connectivity.

### Our Vision
A world where internet access is a fundamental human right, where communities own their digital infrastructure, and where technology serves people—not corporations.

---

## 📖 What is WayruCO?

WayruCO is a monorepo hub that preserves and continues the Wayru Network mission. Following Wayru Inc.'s transition to open source, WayruCO serves as:

- **Technology Steward**: Maintaining mission-critical Wayru Network repositories
- **Community Hub**: Central coordination point for global contributors
- **Documentation Center**: Comprehensive guides for mission, architecture, and deployment
- **Development Platform**: Unified workspace for building decentralized internet infrastructure

### Monorepo Structure

```
wayruco/
├── apps/              # User-facing applications
│   ├── landing/       # Community landing page
│   ├── explorer-web/  # Network explorer
│   └── ...
├── packages/          # Shared libraries and SDKs
│   ├── manifest/      # Repository manifest system
│   ├── sdk/           # Core Wayru SDK
│   └── ...
├── contracts/         # Smart contracts
│   ├── rewards-system-program/
│   ├── staking/
│   └── ...
├── docs/              # Documentation
│   ├── mission/       # Philosophy, vision, history
│   ├── technical/     # Architecture and APIs
│   └── deployment/    # Deployment guides
└── .kiro/             # Agentic workflow configuration
    ├── steering/      # AI agent guidelines
    └── specs/         # Feature specifications
```

### Key Features

- 🎯 **Interactive Timeline**: 21 verified milestones with scroll-based navigation
- 🚀 **Cybernetic Visualization**: Immersive animated experience with ship tracking
- 📊 **Milestone Details**: Comprehensive information with verified proof links
- 🎵 **Audio Feedback**: Robotic beep notifications with toggle control
- 📱 **Responsive Design**: Full-screen experience optimized for exploration
- 🔗 **Community Links**: Direct access to GitHub, documentation, and resources

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22.18.0+
- pnpm 8.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/wayruco/wayruco.git
cd wayruco

# Install dependencies
pnpm install

# Start development server for landing page
pnpm dev:landing
```

Visit `http://localhost:3000` to see the landing page.

### Monorepo Commands

```bash
# Start all apps in development mode
pnpm dev

# Build all packages and apps
pnpm build

# Build specific workspace
pnpm build:landing
pnpm build:packages
pnpm build:apps
pnpm build:contracts

# Run tests
pnpm test
pnpm test:unit
pnpm test:integration

# Lint and format
pnpm lint
pnpm format
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or export landing page as static site
pnpm build:landing
```

---

## 🛠️ Core Principles

### 1. Decentralization First
- No single point of control
- Community-owned networks
- Open protocols over proprietary solutions
- Transparent governance

### 2. Access for All
- Affordable hardware solutions
- Low-bandwidth efficiency
- Multi-language support
- Inclusive design

### 3. Privacy by Design
- End-to-end encryption
- Zero tracking
- User-controlled data
- Open-source security audits

### 4. Community-Driven
- Open development process
- Transparent decision-making
- Contributor recognition
- Shared ownership

---

## 📚 Documentation

### Mission & Philosophy
- [Philosophy](./docs/mission/PHILOSOPHY.md) - Core beliefs and values
- [Vision](./docs/mission/VISION.md) - Long-term goals and roadmap
- [History](./docs/mission/HISTORY.md) - Wayru Network origins and journey

### Getting Started
- [Installation Guide](./docs/INSTALLATION.md)
- [Development Setup](./docs/DEVELOPMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

### Monorepo Structure
- [Workspace Organization](./docs/WORKSPACE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

### Deployment
- [Deployment Guide](./DEPLOYMENT_CHECKLIST.md)
- [Release Notes](./RELEASE_NOTES.md)
- [Changelog](./CHANGELOG.md)

---

## 🤝 Contributing

We welcome contributions from everyone! Whether you're a developer, designer, writer, or community member, there's a place for you.

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub or use GitHub CLI
   gh repo fork wayruco/wayruco --clone
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow our [Code of Conduct](./CODE_OF_CONDUCT.md)
   - Write clear commit messages
   - Add tests for new features
   - Update documentation

4. **Submit a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Contribution Guidelines

#### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Format with Prettier
- Write meaningful comments

#### Commit Messages
```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Restructure code
test: Add tests
chore: Update dependencies
```

#### Pull Request Process
1. Update documentation
2. Add/update tests
3. Ensure all checks pass
4. Request review from maintainers
5. Address feedback
6. Merge when approved

### Areas for Contribution

- **Frontend**: UI improvements, animations, accessibility
- **Documentation**: Guides, tutorials, translations
- **Testing**: Unit tests, integration tests, E2E tests
- **Design**: Visual improvements, UX enhancements
- **Community**: Feedback, bug reports, feature requests

---

## 📋 Roadmap

### v1.0.0 (Current) ✅
- Interactive timeline with 21 milestones
- Cybernetic visualization
- Audio feedback system
- Responsive design

### v1.1.0 (Planned)
- Mobile responsive design
- Additional visualization modes
- Community contributions showcase
- Multi-language support

### v1.2.0 (Planned)
- Real-time data integration
- Community forum integration
- Advanced filtering and search
- Export timeline data

### v2.0.0 (Future)
- Live network status dashboard
- Community contribution tracker
- Educational resources
- Developer API

---

## 🏗️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14.2.23 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| UI Components | shadcn/ui |
| Animation | CSS + React Hooks |
| Audio | Web Audio API |
| Build Tool | Next.js Build |

---

## 📊 Project Statistics

- **Version**: 1.0.0
- **Build Number**: 2025.12.31.001
- **Milestones**: 21 verified events
- **Page Size**: 8.52 kB
- **First Load JS**: 104 kB
- **Build Time**: ~30 seconds
- **Frame Rate**: 60 FPS

---

## 🔗 Important Links

### Community & Resources
- 🌐 **Website**: [wayru.co](https://wayru.co)
- 📖 **Documentation**: [docs.wayru.co](https://docs.wayru.co)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/wayruco/wayruco/issues)
- 📧 **Email**: hello@wayru.co

### Original Project
- 🔗 **Wayru Network**: [wayru.co](https://wayru.co)
- 📱 **Twitter**: [@wayrunetwork](https://twitter.com/wayrunetwork)
- 💼 **LinkedIn**: [Wayru Network](https://linkedin.com/company/wayru-network)

---

## 👥 Team & Contributors

### Founders
- **Charvel Chedraui** - Founder & CEO (Wayru)
- **Paula Ceballos** - Co-founder & CCO/CMO (Wayru)
- **Edward Calderón** - Co-founder & CTO (Wayru)

### Current Maintainers
- **Edward Calderón** - Lead Developer & Project Maintainer

### Contributors
We recognize all community contributors! See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for the full list.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What This Means
- ✅ You can use this code for any purpose
- ✅ You can modify and distribute it
- ✅ You must include the license and copyright notice
- ✅ The software is provided "as is" without warranty

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

---

## 🙏 Acknowledgments

- **Wayru Network** for the original vision and mission
- **Algorand Foundation** for early support and acceleration
- **Borderless Capital** for seed funding
- **Community members** for ongoing support and contributions

---

## 📞 Support & Contact

### Get Help
- 📖 Check the [Documentation](./docs)
- 💬 Ask in [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- 🐛 Report bugs in [GitHub Issues](https://github.com/wayruco/wayruco/issues)
- 📧 Email: hello@wayru.co

### Report Security Issues
Please email security@wayru.co with details about the vulnerability.

---

## 🌟 Show Your Support

If you believe in our mission, please:
- ⭐ Star this repository
- 🍴 Fork and contribute
- 📢 Share with your network
- 💬 Join our community

---

> **"The internet was meant to be free. Let's keep it that way."**  
> — Edward Calderón, Co-founder

---

**Made with ❤️ by the WayruCo Community**  
*Decentralized connectivity for everyone.*
