#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load root version
const rootVersionPath = path.join(__dirname, '..', 'version.json');
const { version } = JSON.parse(fs.readFileSync(rootVersionPath, 'utf8'));

if (!version) {
    console.error('❌ Could not read version from version.json');
    process.exit(1);
}

// Directories to scan for package.json files (apps and packages)
const dirs = ['apps', 'packages'];

function updatePackageJson(pkgPath) {
    const pkgFile = path.join(pkgPath, 'package.json');
    if (!fs.existsSync(pkgFile)) return;
    const pkgData = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
    if (pkgData.version && pkgData.version !== version) {
        console.log(`🔧 Updating ${pkgFile} version ${pkgData.version} → ${version}`);
        pkgData.version = version;
        fs.writeFileSync(pkgFile, JSON.stringify(pkgData, null, 2) + '\n');
    }
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // If this directory contains a package.json, update it
            const pkgJson = path.join(fullPath, 'package.json');
            if (fs.existsSync(pkgJson)) {
                updatePackageJson(fullPath);
            }
            // Recurse deeper (e.g., nested packages)
            walk(fullPath);
        }
    }
}

for (const base of dirs) {
    const basePath = path.join(__dirname, '..', base);
    if (fs.existsSync(basePath)) {
        walk(basePath);
    }
}

// ---- Additional sync for landing app's version.json ----
const landingVersionPath = path.join(__dirname, '..', 'apps', 'landing', 'version.json');
if (fs.existsSync(landingVersionPath)) {
    // Copy the root version.json content to the landing version file
    const rootData = JSON.parse(fs.readFileSync(rootVersionPath, 'utf8'));
    fs.writeFileSync(landingVersionPath, JSON.stringify(rootData, null, 2) + '\n');
    console.log(`🔧 Synced apps/landing/version.json to version ${version}`);
}

console.log('✅ Version synchronization complete.');
