#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const versionFile = path.join(__dirname, "../version.json");
const changelogFile = path.join(__dirname, "../CHANGELOG.md");

// Parse command line arguments
const args = process.argv.slice(2);
const bumpType = args[0] || "patch";
const releaseTag = args.includes("--release-tag");

if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("❌ Invalid bump type. Use: patch, minor, or major");
  process.exit(1);
}

console.log(`🚀 Starting version bump: ${bumpType}`);
if (releaseTag) {
  console.log("🏷️  Release tag mode enabled");
}
console.log("");

// Helper function to execute git commands
function runGitCommand(command, description) {
  try {
    const result = require("child_process")
      .execSync(command, { encoding: "utf8" })
      .trim();
    console.log(`✅ ${description}: ${result}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Failed to ${description.toLowerCase()}: ${error.message}`,
    );
    process.exit(1);
  }
}

// Check if we're in a git repo
try {
  require("child_process").execSync("git rev-parse --git-dir", {
    stdio: "ignore",
  });
} catch (error) {
  console.error("❌ Not in a git repository");
  process.exit(1);
}

// Check for uncommitted changes
const gitStatus = require("child_process")
  .execSync("git status --porcelain", { encoding: "utf8" })
  .trim();
if (gitStatus) {
  console.log("⚠️  Found uncommitted changes:");
  console.log(gitStatus);
  console.log("");

  // Auto-stage and commit changes
  console.log("📝 Auto-staging and committing changes...");
  runGitCommand("git add .", "Staging changes");

  const commitMessage = `chore: auto-commit before version bump\n\nAuto-generated commit before version update`;
  runGitCommand(`git commit -m "${commitMessage}"`, "Committing changes");
  console.log("");
}

// Get recent commits for changelog
console.log("📋 Analyzing recent commits...");
const lastTag = require("child_process")
  .execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', {
    encoding: "utf8",
  })
  .trim();
const commitRange = lastTag ? `${lastTag}..HEAD` : "HEAD";
const recentCommits = require("child_process")
  .execSync(`git log ${commitRange} --pretty=format:"%h %s" --no-merges`, {
    encoding: "utf8",
  })
  .trim()
  .split("\n");

console.log(
  `📊 Found ${recentCommits.length} recent commits since ${lastTag || "beginning"}`,
);

// Categorize commits
const categories = {
  Added: [],
  Changed: [],
  Fixed: [],
  Deprecated: [],
  Removed: [],
  Security: [],
  Other: [],
};

recentCommits.forEach((commit) => {
  const [hash, ...messageParts] = commit.split(" ");
  const message = messageParts.join(" ").toLowerCase();

  if (
    message.startsWith("feat") ||
    message.startsWith("add") ||
    message.includes("new")
  ) {
    categories.Added.push(commit);
  } else if (
    message.startsWith("refactor") ||
    message.startsWith("change") ||
    message.includes("update")
  ) {
    categories.Changed.push(commit);
  } else if (message.startsWith("fix") || message.includes("bug")) {
    categories.Fixed.push(commit);
  } else if (message.startsWith("deprecate")) {
    categories.Deprecated.push(commit);
  } else if (message.startsWith("remove") || message.includes("delete")) {
    categories.Removed.push(commit);
  } else if (
    message.includes("security") ||
    message.includes("vulnerability")
  ) {
    categories.Security.push(commit);
  } else {
    categories.Other.push(commit);
  }
});

console.log("📝 Commit categorization complete");
console.log("");

// Read current version
const versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
const currentVersion = versionData.version;

// Parse version
const [major, minor, patch] = currentVersion.split(".").map(Number);

// Calculate new version
let newVersion;
switch (bumpType) {
  case "major":
    newVersion = `${major + 1}.0.0`;
    break;
  case "minor":
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case "patch":
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update version.json
const today = new Date().toISOString().split("T")[0];
const buildNumber =
  today.replace(/-/g, ".") +
  "." +
  String(Math.floor(Math.random() * 1000)).padStart(3, "0");

versionData.version = newVersion;
versionData.buildNumber = buildNumber;
versionData.releaseDate = today;
versionData.build.timestamp = new Date().toISOString();

// Get current git info
versionData.git.commit = runGitCommand(
  "git rev-parse HEAD",
  "Getting current commit",
);
versionData.git.branch = runGitCommand(
  "git rev-parse --abbrev-ref HEAD",
  "Getting current branch",
);

fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

// Sync landing app version.json
const landingVersionFile = path.join(__dirname, "../apps/landing/version.json");
try {
  const landingVersionData = JSON.parse(fs.readFileSync(landingVersionFile, "utf8"));
  landingVersionData.version = newVersion;
  landingVersionData.buildNumber = buildNumber;
  landingVersionData.releaseDate = today;
  landingVersionData.build.timestamp = new Date().toISOString();
  landingVersionData.git.commit = versionData.git.commit;
  landingVersionData.git.branch = versionData.git.branch;
  fs.writeFileSync(landingVersionFile, JSON.stringify(landingVersionData, null, 2));
  console.log(`✅ Landing app version.json synced`);
} catch (error) {
  console.warn(`⚠️  Could not sync landing app version.json: ${error.message}`);
}

// Sync landing app package.json
const landingPackageFile = path.join(__dirname, "../apps/landing/package.json");
try {
  const landingPackageData = JSON.parse(fs.readFileSync(landingPackageFile, "utf8"));
  landingPackageData.version = newVersion;
  fs.writeFileSync(landingPackageFile, JSON.stringify(landingPackageData, null, 2));
  console.log(`✅ Landing app package.json synced`);
} catch (error) {
  console.warn(`⚠️  Could not sync landing app package.json: ${error.message}`);
}

console.log(`✅ Version bumped: ${currentVersion} → ${newVersion}`);
console.log(`📦 Build number: ${buildNumber}`);
console.log(`📅 Release date: ${today}`);
console.log(`🔗 Git commit: ${versionData.git.commit.substring(0, 7)}`);
console.log("");

// Generate changelog entries
const changelogEntries = [];
Object.entries(categories).forEach(([category, commits]) => {
  if (commits.length > 0) {
    changelogEntries.push(`### ${category}`);
    commits.forEach((commit) => {
      const [hash, ...messageParts] = commit.split(" ");
      const message = messageParts.join(" ");
      changelogEntries.push(`- ${message} (${hash})`);
    });
    changelogEntries.push("");
  }
});

// Update changelog
const changelogContent = fs.readFileSync(changelogFile, "utf8");
const newSection = `## [${newVersion}] - ${today}

${changelogEntries.join("\n").trim()}

`;

const updatedChangelog = changelogContent.replace(
  "## [Unreleased]",
  `## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

${newSection}`,
);

fs.writeFileSync(changelogFile, updatedChangelog);
console.log("✅ CHANGELOG.md updated with auto-generated entries");

// Update version history table
const tableRegex =
  /(\| Version \| Release Date \| Build Number \| Status \|\n\|[\s\|]+\n)((?:\|.*\|\n)*)/;
const tableMatch = updatedChangelog.match(tableRegex);

if (tableMatch) {
  const newTableRow = `| ${newVersion} | ${today} | ${buildNumber} | Current |\n`;
  const existingRows = tableMatch[2];
  const updatedRows = existingRows.replace(/Current/g, "Stable") + newTableRow;

  const finalChangelog = updatedChangelog.replace(
    tableMatch[0],
    tableMatch[1] + updatedRows,
  );

  fs.writeFileSync(changelogFile, finalChangelog);
  console.log("✅ Version history table updated");
}

// Git operations
console.log("");
console.log("🔄 Performing Git operations...");

// Stage all changes
runGitCommand("git add version.json CHANGELOG.md", "Staging version files");

// Commit version bump
const versionCommitMessage = `chore: bump version to ${newVersion}

📦 Version: ${newVersion}
🏷️  Build: ${buildNumber}
📅 Date: ${today}
🔗 Commit: ${versionData.git.commit.substring(0, 7)}

Auto-generated changelog entries:
${changelogEntries
  .map((entry) =>
    entry.replace(/^### /, "  - ").replace(/^- (.*) \(.*/, "- $1"),
  )
  .filter(Boolean)
  .join("\n")}

[skip ci]`;

runGitCommand(
  `git commit -m "${versionCommitMessage}"`,
  "Committing version bump",
);

// Create and push tag if requested
if (releaseTag) {
  console.log("");
  console.log("🏷️  Creating release tag...");
  const tagMessage = `Release ${newVersion}

${changelogEntries
  .filter((entry) => !entry.startsWith("###"))
  .join("\n")
  .trim()}`;

  runGitCommand(
    `git tag -a v${newVersion} -m "${tagMessage}"`,
    `Creating tag v${newVersion}`,
  );

  // Push commits
  console.log("");
  console.log("📤 Pushing to remote...");
  runGitCommand("git push origin", "Pushing commits");

  // Push tag
  runGitCommand(`git push origin v${newVersion}`, "Pushing release tag");

  console.log("");
  console.log("🎉 Release complete!");
  console.log(
    `🌐 View release at: https://github.com/wayruco/wayruco/releases/tag/v${newVersion}`,
  );
} else {
  console.log("");
  console.log("📝 Version bump complete!");
  console.log("💡 To create a release tag, run: npm run version:release");
}

console.log("");
console.log("📋 Summary:");
console.log(`   Version: ${currentVersion} → ${newVersion}`);
console.log(`   Build: ${buildNumber}`);
console.log(`   Date: ${today}`);
console.log(`   Commits: ${recentCommits.length}`);
console.log(
  `   Tag created: ${releaseTag ? "Yes ✅" : "No (use --release-tag)"}`,
);
console.log(`   Pushed to remote: ${releaseTag ? "Yes ✅" : "No"}`);
