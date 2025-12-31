#!/usr/bin/env node

/**
 * Sync Upstream Script
 * Syncs forked repositories with their upstream sources
 * 
 * Usage:
 *   node scripts/sync-upstream.js [workspace-name]
 *   
 * Examples:
 *   node scripts/sync-upstream.js                    # Sync all
 *   node scripts/sync-upstream.js @wayruco/manifest  # Sync specific
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Sync a single repository
 */
function syncRepository(repo) {
  const { name, workspace, upstreamSync } = repo;
  
  if (!upstreamSync.enabled) {
    console.log(`⊘ Skipping ${name} (sync disabled)`);
    return;
  }
  
  if (!fs.existsSync(workspace)) {
    console.log(`⊘ Skipping ${name} (workspace not found: ${workspace})`);
    return;
  }
  
  console.log(`Syncing ${name}...`);
  
  try {
    // Add upstream remote if not exists
    try {
      execSync(`cd ${workspace} && git remote add upstream ${repo.source}`, {
        stdio: 'pipe'
      });
    } catch (e) {
      // Remote might already exist
    }
    
    // Fetch from upstream
    execSync(`cd ${workspace} && git fetch upstream ${upstreamSync.branch}`, {
      stdio: 'pipe'
    });
    
    // Merge upstream changes
    execSync(`cd ${workspace} && git merge upstream/${upstreamSync.branch}`, {
      stdio: 'pipe'
    });
    
    console.log(`✓ Synced ${name}`);
  } catch (error) {
    console.error(`✗ Failed to sync ${name}: ${error.message}`);
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const filterName = args[0];
  
  // Load manifest
  const manifest = loadManifest();
  
  // Filter repositories
  let repos = manifest.repositories;
  
  if (filterName) {
    repos = repos.filter(repo => {
      const workspaceName = getWorkspaceName(repo.workspace);
      return repo.name === filterName || workspaceName === filterName;
    });
    
    if (repos.length === 0) {
      console.error(`No repositories found matching: ${filterName}`);
      process.exit(1);
    }
  }
  
  console.log(`Syncing ${repos.length} repositories...`);
  console.log('');
  
  // Sync each repository
  repos.forEach(repo => {
    syncRepository(repo);
  });
  
  console.log('');
  console.log('✓ Sync complete');
}

// Run main function
main();
