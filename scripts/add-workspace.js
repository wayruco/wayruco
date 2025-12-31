#!/usr/bin/env node

/**
 * Add Workspace Script
 * Automatically adds a new workspace to the monorepo
 * 
 * Usage:
 *   node scripts/add-workspace.js <name> <category> [description]
 *   
 * Examples:
 *   node scripts/add-workspace.js my-sdk package "Core SDK"
 *   node scripts/add-workspace.js my-app app "User application"
 *   node scripts/add-workspace.js my-contract contract "Smart contract"
 */

const fs = require('fs');
const path = require('path');

/**
 * Valid workspace categories
 */
const VALID_CATEGORIES = ['app', 'package', 'contract', 'tool'];

/**
 * Get workspace path based on category
 */
function getWorkspacePath(category, name) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  switch (category) {
    case 'app':
      return `apps/${normalizedName}`;
    case 'contract':
      return `contracts/${normalizedName}`;
    case 'tool':
    case 'package':
    default:
      return `packages/${normalizedName}`;
  }
}

/**
 * Create workspace directory structure
 */
function createWorkspaceStructure(workspacePath) {
  const srcPath = path.join(workspacePath, 'src');
  const testsPath = path.join(srcPath, '__tests__');
  
  // Create directories
  [workspacePath, srcPath, testsPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create .gitkeep files
  fs.writeFileSync(path.join(testsPath, '.gitkeep'), '');
}

/**
 * Create package.json for workspace
 */
function createPackageJson(workspacePath, name, category, description) {
  const packageName = `@wayruco/${name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
  
  const packageJson = {
    name: packageName,
    version: '1.0.0',
    private: true,
    description: description || `WayruCO ${category}`,
    main: category === 'app' ? undefined : 'dist/index.js',
    types: category === 'app' ? undefined : 'dist/index.d.ts',
    scripts: {
      build: category === 'app' ? 'next build' : 'tsc',
      dev: category === 'app' ? 'next dev' : undefined,
      test: 'vitest',
      'test:unit': 'vitest run',
      lint: 'eslint src --ext .ts,.tsx',
      'type-check': 'tsc --noEmit'
    },
    dependencies: {},
    devDependencies: {
      '@types/node': '^20',
      typescript: '^5',
      vitest: '^1.0.0'
    }
  };
  
  // Remove undefined values
  Object.keys(packageJson).forEach(key => {
    if (packageJson[key] === undefined) {
      delete packageJson[key];
    }
  });
  
  Object.keys(packageJson.scripts).forEach(key => {
    if (packageJson.scripts[key] === undefined) {
      delete packageJson.scripts[key];
    }
  });
  
  fs.writeFileSync(
    path.join(workspacePath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );
}

/**
 * Create tsconfig.json for workspace
 */
function createTsConfig(workspacePath) {
  const tsConfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src',
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    include: ['src'],
    exclude: ['node_modules', 'dist']
  };
  
  fs.writeFileSync(
    path.join(workspacePath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2) + '\n'
  );
}

/**
 * Create README.md for workspace
 */
function createReadme(workspacePath, name, category, description) {
  const readme = `# @wayruco/${name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}

${description || `WayruCO ${category}`}

## Installation

\`\`\`bash
pnpm install
\`\`\`

## Development

\`\`\`bash
pnpm dev
\`\`\`

## Building

\`\`\`bash
pnpm build
\`\`\`

## Testing

\`\`\`bash
pnpm test
\`\`\`

## License

MIT
`;
  
  fs.writeFileSync(path.join(workspacePath, 'README.md'), readme);
}

/**
 * Update pnpm-workspace.yaml
 */
function updateWorkspaceYaml(workspacePath) {
  const workspaceYamlPath = 'pnpm-workspace.yaml';
  
  if (!fs.existsSync(workspaceYamlPath)) {
    console.warn('pnpm-workspace.yaml not found');
    return;
  }
  
  let content = fs.readFileSync(workspaceYamlPath, 'utf-8');
  
  // Check if workspace path is already included
  const category = workspacePath.split('/')[0];
  const pattern = `  - '${category}/*'`;
  
  if (!content.includes(pattern)) {
    // Add workspace pattern if not present
    content = content.replace(
      'packages:',
      `packages:\n${pattern}`
    );
    fs.writeFileSync(workspaceYamlPath, content);
  }
}

/**
 * Update turbo.json
 */
function updateTurboJson(workspacePath) {
  const turboJsonPath = 'turbo.json';
  
  if (!fs.existsSync(turboJsonPath)) {
    console.warn('turbo.json not found');
    return;
  }
  
  const turboJson = JSON.parse(fs.readFileSync(turboJsonPath, 'utf-8'));
  
  // Turbo automatically detects workspaces, no need to update
  // But we could add specific pipeline configs if needed
  
  fs.writeFileSync(turboJsonPath, JSON.stringify(turboJson, null, 2) + '\n');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node scripts/add-workspace.js <name> <category> [description]');
    console.error('');
    console.error('Categories: app, package, contract, tool');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/add-workspace.js my-sdk package "Core SDK"');
    console.error('  node scripts/add-workspace.js my-app app "User application"');
    process.exit(1);
  }
  
  const [name, category, description] = args;
  
  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    console.error(`Invalid category: ${category}`);
    console.error(`Valid categories: ${VALID_CATEGORIES.join(', ')}`);
    process.exit(1);
  }
  
  // Get workspace path
  const workspacePath = getWorkspacePath(category, name);
  
  // Check if workspace already exists
  if (fs.existsSync(workspacePath)) {
    console.error(`Workspace already exists: ${workspacePath}`);
    process.exit(1);
  }
  
  console.log(`Creating workspace: ${workspacePath}`);
  
  // Create workspace structure
  createWorkspaceStructure(workspacePath);
  console.log('✓ Created directory structure');
  
  // Create configuration files
  createPackageJson(workspacePath, name, category, description);
  console.log('✓ Created package.json');
  
  createTsConfig(workspacePath);
  console.log('✓ Created tsconfig.json');
  
  createReadme(workspacePath, name, category, description);
  console.log('✓ Created README.md');
  
  // Update monorepo configuration
  updateWorkspaceYaml(workspacePath);
  console.log('✓ Updated pnpm-workspace.yaml');
  
  updateTurboJson(workspacePath);
  console.log('✓ Updated turbo.json');
  
  console.log('');
  console.log(`✓ Workspace created successfully!`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. cd ${workspacePath}`);
  console.log('  2. Create src/index.ts');
  console.log('  3. Run: pnpm install');
  console.log('  4. Run: pnpm build');
}

// Run main function
main();
