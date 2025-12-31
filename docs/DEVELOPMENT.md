# Development Guide

## Project Structure

```
wayruco/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── WayruTimeline.tsx   # Timeline component
│   │   ├── CyberneticScene.tsx # Visualization
│   │   ├── NarrativeOverlay.tsx # Text overlay
│   │   ├── NavigationButtons.tsx # Navigation
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   └── use-mobile.tsx      # Mobile detection
│   └── lib/
│       ├── sounds.ts           # Audio utilities
│       ├── utils.ts            # Helper functions
│       └── version.ts          # Version info
├── public/                      # Static assets
├── docs/                        # Documentation
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.js              # Next.js config
└── README.md                   # Project README
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

The app will hot-reload on file changes.

### 2. Make Changes

Edit files in the `src/` directory. Changes are reflected immediately.

### 3. Check for Errors

```bash
# TypeScript errors
npx tsc --noEmit

# ESLint issues
npx eslint src/

# Build check
npm run check-build
```

### 4. Test Changes

- Open `http://localhost:3000` in your browser
- Test the timeline scroll functionality
- Verify milestone cards are clickable
- Test audio feedback
- Check responsive design

## Key Components

### WayruTimeline.tsx
Main timeline component with:
- Milestone rendering
- Scroll tracking
- Audio feedback
- Progress indicators

**Key Props:**
- `phase: number` - Scroll progress (0-1)

### CyberneticScene.tsx
Animated background with:
- Digital river
- Particles
- Holographic ship
- Atmospheric effects

**Key Props:**
- `phase: number` - Animation progress

### NarrativeOverlay.tsx
Text overlay with:
- Dynamic content
- Scroll indicator
- Responsive positioning

**Key Props:**
- `phase: number` - Content phase

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Configuration in `tailwind.config.ts`
- Global styles in `src/app/globals.css`

### Custom CSS
- Animations in `globals.css`
- Component-specific styles inline
- CSS variables for theming

### Color Scheme
- Primary: Cyan (#00d9ff)
- Secondary: Blue (#4a9fb8)
- Background: Dark (#0a0e1a)
- Accent: Various category colors

## Performance Optimization

### Code Splitting
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Lazy loading of images

### Bundle Size
- Current: 8.52 kB (main page)
- First Load JS: 104 kB
- Monitor with `npm run build`

### Animation Performance
- Use CSS animations when possible
- Optimize React re-renders
- Target 60 FPS

## Testing

### Manual Testing
1. Test timeline scroll
2. Click milestones
3. Toggle sound
4. Check responsive design
5. Verify links work

### Browser Testing
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Debugging

### Browser DevTools
```javascript
// In console
// Check phase value
window.__phase

// Test audio
new (window.AudioContext || window.webkitAudioContext)()
```

### Next.js Debug Mode
```bash
DEBUG=* npm run dev
```

### TypeScript Debugging
```bash
# Check types
npx tsc --noEmit --pretty
```

## Common Tasks

### Add a New Milestone

Edit `src/components/WayruTimeline.tsx`:

```typescript
const timelineEvents: TimelineEvent[] = [
  // ... existing events
  {
    date: "2025-12-15",
    title: "New Milestone",
    summary: "Description of the milestone",
    category: "Founding",
    proofLinks: [
      { label: "Source", url: "https://example.com", type: "primary" }
    ],
  },
];
```

### Update Colors

Edit `src/components/WayruTimeline.tsx`:

```typescript
const categoryColors = {
  Founding: { 
    bg: "bg-emerald-500/20", 
    border: "border-emerald-400/50", 
    text: "text-emerald-300", 
    glow: "rgba(52, 211, 153, 0.5)" 
  },
  // ... other categories
};
```

### Modify Animation Speed

Edit `src/app/page.tsx`:

```typescript
const duration = 189000; // 189 seconds (9 seconds per milestone)
```

### Change Timeline Duration

Edit `src/app/page.tsx`:

```typescript
// For 21 milestones at X seconds each:
// duration = 21 * X * 1000 (in milliseconds)
const duration = 21 * 9 * 1000; // 9 seconds per milestone
```

## Build Process

### Development Build
```bash
npm run dev
```
- Fast compilation
- Source maps enabled
- Hot module reloading

### Production Build
```bash
npm run build
```
- Optimized bundle
- Minified code
- Tree shaking

### Static Export
```bash
npm run build:static
```
- Generates static HTML
- No server required
- Suitable for CDN

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build:static
# Deploy 'out' directory
```

### Docker
```bash
docker build -t wayruco .
docker run -p 3000:3000 wayruco
```

## Environment Setup

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Prettier - Code formatter
- ESLint

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## Getting Help

- 💬 [GitHub Discussions](https://github.com/wayruco/wayruco/discussions)
- 🐛 [GitHub Issues](https://github.com/wayruco/wayruco/issues)
- 📧 Email: hello@wayru.co

---

**Happy developing! 🚀**
