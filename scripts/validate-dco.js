#!/usr/bin/env node

/**
 * DCO (Developer Certificate of Origin) Validation Script
 * Validates that commits include a Signed-off-by line
 * 
 * Usage:
 *   node scripts/validate-dco.js <commit-message-file>
 *   
 * This script is typically used as a git hook:
 *   - commit-msg hook: Validates individual commits
 *   - pre-push hook: Validates all commits being pushed
 */

const fs = require('fs');
const path = require('path');

/**
 * DCO Signature pattern
 * Matches: Signed-off-by: Name <email@example.com>
 */
const DCO_PATTERN = /^Signed-off-by:\s+.+\s+<.+@.+\..+>$/m;

/**
 * Validates a commit message for DCO compliance
 * @param {string} message - The commit message to validate
 * @returns {boolean} True if message contains valid DCO signature
 */
function validateDCO(message) {
  return DCO_PATTERN.test(message);
}

/**
 * Extracts the DCO signature from a commit message
 * @param {string} message - The commit message
 * @returns {string|null} The DCO signature or null if not found
 */
function extractDCOSignature(message) {
  const match = message.match(DCO_PATTERN);
  return match ? match[0] : null;
}

/**
 * Main validation function
 */
function main() {
  // Get commit message file from arguments
  const commitMessageFile = process.argv[2];

  if (!commitMessageFile) {
    console.error('Error: Commit message file not provided');
    console.error('Usage: node scripts/validate-dco.js <commit-message-file>');
    process.exit(1);
  }

  // Read commit message
  let commitMessage;
  try {
    commitMessage = fs.readFileSync(commitMessageFile, 'utf-8');
  } catch (error) {
    console.error(`Error reading commit message file: ${error.message}`);
    process.exit(1);
  }

  // Remove comments (lines starting with #)
  const lines = commitMessage.split('\n');
  const messageLines = lines.filter(line => !line.startsWith('#'));
  const cleanMessage = messageLines.join('\n').trim();

  // Skip validation for merge commits
  if (cleanMessage.startsWith('Merge ')) {
    console.log('✓ Merge commit - DCO validation skipped');
    process.exit(0);
  }

  // Validate DCO
  if (!validateDCO(cleanMessage)) {
    console.error('✗ DCO validation failed');
    console.error('');
    console.error('Your commit message must include a Developer Certificate of Origin (DCO) signature.');
    console.error('');
    console.error('Add the following line to your commit message:');
    console.error('  Signed-off-by: Your Name <your.email@example.com>');
    console.error('');
    console.error('You can automatically add this to your commits by using:');
    console.error('  git commit -s -m "Your commit message"');
    console.error('');
    console.error('For more information about the DCO, see:');
    console.error('  https://developercertificate.org/');
    console.error('');
    process.exit(1);
  }

  const signature = extractDCOSignature(cleanMessage);
  console.log('✓ DCO validation passed');
  console.log(`  ${signature}`);
  process.exit(0);
}

// Run validation
main();
