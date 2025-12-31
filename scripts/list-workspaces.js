#!/usr/bin/env node

/**
 * List Workspaces Script
 * Displays all workspaces in the monorepo
 * 
 * Usage:
 *   node scripts/list-workspaces.js [--json] [--filter=category]
 *   
 * Examples:
 *   node scripts/list-workspaces.js                    # List all
 *   node scripts/list-workspaces.js --json             # JSON output
 *   node scripts/list-workspaces.js --filter=app       # Filter by category
 */

const fs = require('fs');
const path = require('path');

/**
 * Load manifest
 */
function loadManifest() {
  const manifestPath = '.wayruco/manifest.json';
  
  if (!fs.existsSync(manifestPath)) {
    console.error('Manifest not found: .wayruco/manifest.json');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

/**
 * Get workspace name from package.json
 */
function getWorkspaceName(workspacePath) {
  const packageJsonPath = path.join(workspacePath, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.name;
}

/**
 * Check if workspace exists
 */
function workspaceExists(workspacePath) {
  return fs.existsSync(workspacePath);
}

/**
 * Format table output
 */
function formatTable(repos) {
  const headers = ['Name', 'Category', 'Status', 'Path', 'Exists'];
  const rows = repos.map(repo => [
    repo.name,
    repo.category,
    repo.status,
    repo.workspace,
    workspaceExists(repo.workspace) ? '✓' : '✗'
  ]);
  
  // Calculate column widths
  const widths = headers.map((header, i) => {
    const maxRowWidth = Math.max(...rows.map(row => String(row[i]).length));
    return Math.max(header.length, maxRowWidth);
  });
  
  // Print header
  const headerRow = headers
    .map((header, i) => header.padEnd(widths[i]))
    .join(' | ');
  console.log(headerRow);
  console.log('-'.repeat(headerRow.length));
  
  // Print rows
  rows.forEach(row => {
    const formattedRow = row
      .map((cell, i) => String(cell).padEnd(widths[i]))
      .join(' | ');
    console.log(formattedRow);
  });
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let jsonOutput = false;
  let filterCategory = null;
  
  args.forEach(arg => {
    if (arg === '--json') {
      jsonOutput = true;
    } else if (arg.startsWith('--filter=')) {
      filterCategory = arg.split('=')[1];
    }
  });
  
  // Load manifest
  const manifest = loadManifest();
  
  // Filter repositories
  let repos = manifest.repositories;
  
  if (filterCategory) {
    repos = repos.filter(repo => repo.category === filterCategory);
  }
  
  // Sort by name
  repos.sort((a, b) => a.name.localeCompare(b.name));
  
  // Output
  if (jsonOutput) {
    console.log(JSON.stringify(repos, null, 2));
  } else {
    console.log(`WayruCO Workspaces (${repos.length} total)`);
    console.log('');
    
    // Group by category
    const byCategory = {};
    repos.forEach(repo => {
      if (!byCategory[repo.category]) {
        byCategory[repo.category] = [];
      }
      byCategory[repo.category].push(repo);
    });
    
    // Print by category
    Object.keys(byCategory).sort().forEach(category => {
      console.log(`${category.toUpperCase()} (${byCategory[category].length})`);
      console.log('');
      formatTable(byCategory[category]);
      console.log('');
    });
    
    // Summary
    const integrated = repos.filter(r => r.status === 'integrated').length;
    const forked = repos.filter(r => r.status === 'forked').length;
    const pending = repos.filter(r => r.status === 'pending').length;
    
    console.log('Summary:');
    console.log(`  Integrated: ${integrated}`);
    console.log(`  Forked: ${forked}`);
    console.log(`  Pending: ${pending}`);
  }
}

// Run main function
main();
