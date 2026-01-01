#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load current version info
const versionFile = path.join(__dirname, '..', 'version.json');
const versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
const version = versionData.version;

if (!version) {
    console.error('❌ No version found in version.json');
    process.exit(1);
}

const tagName = `v${version}`;

// Build tag message – include changelog excerpt for this version if present
let tagMessage = `Release ${tagName}`;

// Try to extract the changelog section for this version
try {
    const changelog = fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
    const regex = new RegExp(`##\\s*\\[${version}\\]\\s*-\\s*([\\d-]+)\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = changelog.match(regex);
    if (match) {
        const notes = match[2].trim();
        if (notes) {
            tagMessage += `\n\n${notes}`;
        }
    }
} catch (e) {
    // ignore – tag will just have the simple message
}

function runGit(command, description) {
    try {
        const out = execSync(command, { stdio: 'inherit' });
        return out;
    } catch (err) {
        console.error(`❌ ${description} failed`);
        process.exit(1);
    }
}

console.log(`🚀 Creating tag ${tagName}`);
runGit(`git tag -a ${tagName} -m "${tagMessage.replace(/"/g, '\\"')}"`, 'Creating tag');

console.log('🔄 Pushing commit and tag to remote');
runGit('git push origin main', 'Pushing commit');
runGit(`git push origin ${tagName}`, 'Pushing tag');

console.log(`✅ Release ${tagName} pushed successfully`);
