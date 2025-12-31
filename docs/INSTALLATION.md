# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 22.18.0 or higher
- **npm**: 10.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code, WebStorm, or your preferred editor

### Check Your Versions

```bash
node --version    # Should be v22.18.0 or higher
npm --version     # Should be 10.0.0 or higher
git --version     # Should be 2.40.0 or higher
```

## Installation Steps

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/wayruco/wayruco.git
cd wayruco

# Or using SSH
git clone git@github.com:wayruco/wayruco.git
cd wayruco
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Verify Installation

```bash
npm run check-build
```

You should see:
```
✅ BUILD CHECK PASSED
```

## Development Setup

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Export as Static Site

```bash
npm run build:static
```

The static files will be in the `out` directory.

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript
npm run build

# Or check for type errors
npx tsc --noEmit
```

### Issue: Module not found errors

**Solution:**
```bash
# Ensure all dependencies are installed
npm install

# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

## Environment Variables

No environment variables are required for v1.0.0 (static content only).

For future versions, create a `.env.local` file:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

## System Requirements

### Minimum
- 2GB RAM
- 500MB disk space
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Recommended
- 4GB+ RAM
- 1GB+ disk space
- Latest browser version

## Next Steps

1. Read the [Development Guide](./DEVELOPMENT.md)
2. Check the [Architecture Overview](./ARCHITECTURE.md)
3. Review [Contributing Guidelines](../CONTRIBUTING.md)
4. Explore the [Timeline Component](./TIMELINE.md)

## Getting Help

- 📖 [Documentation](../README.md#-documentation)
- 💬 [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- 🐛 [Report Issues](https://github.com/wayruco/wayruco/issues)
- 📧 Email: hello@wayru.co

---

**Happy coding! 🚀**
