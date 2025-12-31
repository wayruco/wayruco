#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const changelogFile = path.join(__dirname, "../CHANGELOG.md");
const versionFile = path.join(__dirname, "../version.json");

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
const currentVersion = versionData.version;

// Read changelog
const changelogContent = fs.readFileSync(changelogFile, "utf8");

// Check if there are any changes in the Unreleased section
const unreleasedSection = changelogContent.match(
  /## \[Unreleased\]([\s\S]*?)## \[/,
);
if (!unreleasedSection) {
  console.log("❌ No Unreleased section found in CHANGELOG.md");
  process.exit(1);
}

const unreleasedContent = unreleasedSection[1];
const hasChanges = /### (Added|Changed|Fixed|Security)\n[\s\S]*?\n-/.test(
  unreleasedContent,
);

if (!hasChanges) {
  console.log("ℹ️ No changes found in Unreleased section");
  console.log("Add your changes to the Unreleased section first");
  process.exit(0);
}

// Move Unreleased content to current version
const today = new Date().toISOString().split("T")[0];
const versionSection = `## [${currentVersion}] - ${today}`;

const updatedChangelog = changelogContent
  .replace(
    /## \[Unreleased\]([\s\S]*?)## \[/,
    `## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

## [${versionSection}$1## [`,
  )
  .replace(/## \[${currentVersion}\] - \d{4}-\d{2}-\d{2}/, versionSection);

fs.writeFileSync(changelogFile, updatedChangelog);

console.log(`✅ CHANGELOG.md updated for version ${currentVersion}`);
console.log(`📅 Release date: ${today}`);
