#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const versionFile = path.join(__dirname, "../version.json");
const packageFile = path.join(__dirname, "../package.json");
const changelogFile = path.join(__dirname, "../CHANGELOG.md");

console.log("🔍 Checking build status and version consistency...\n");

let hasErrors = false;
let warnings = [];

// Check if version.json exists
if (!fs.existsSync(versionFile)) {
  console.error("❌ version.json not found");
  hasErrors = true;
  process.exit(1);
}

// Read version data
let versionData;
try {
  versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
} catch (error) {
  console.error("❌ Error parsing version.json:", error.message);
  hasErrors = true;
  process.exit(1);
}

// Read package.json
let packageData;
try {
  packageData = JSON.parse(fs.readFileSync(packageFile, "utf8"));
} catch (error) {
  console.error("❌ Error parsing package.json:", error.message);
  hasErrors = true;
  process.exit(1);
}

// Check version format
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(versionData.version)) {
  console.error("❌ Invalid version format in version.json. Expected: x.y.z");
  hasErrors = true;
}

// Check build number format
const buildRegex = /^\d{4}\.\d{2}\.\d{2}\.\d{3}$/;
if (!buildRegex.test(versionData.buildNumber)) {
  console.error("❌ Invalid build number format. Expected: YYYY.MM.DD.NNN");
  hasErrors = true;
}

// Check release date format
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateRegex.test(versionData.releaseDate)) {
  console.error("❌ Invalid release date format. Expected: YYYY-MM-DD");
  hasErrors = true;
}

// Check if build number matches release date
const expectedBuildPrefix = versionData.releaseDate.replace(/-/g, ".");
if (!versionData.buildNumber.startsWith(expectedBuildPrefix)) {
  console.error("❌ Build number does not match release date");
  hasErrors = true;
}

// Check git status (if in git repo)
if (fs.existsSync(".git")) {
  try {
    const gitStatus = execSync("git status --porcelain", { encoding: "utf8" });
    if (gitStatus.trim()) {
      warnings.push("⚠️  Working directory has uncommitted changes");
    }
  } catch (error) {
    warnings.push("⚠️  Could not check git status");
  }

  // Check if current commit matches version.json
  try {
    const currentCommit = execSync("git rev-parse HEAD", {
      encoding: "utf8",
    }).trim();
    if (versionData.git.commit && versionData.git.commit !== currentCommit) {
      warnings.push(
        "⚠️  Git commit in version.json does not match current HEAD",
      );
    }
  } catch (error) {
    warnings.push("⚠️  Could not get current git commit");
  }
}

// Check if changelog exists and has current version
if (fs.existsSync(changelogFile)) {
  const changelogContent = fs.readFileSync(changelogFile, "utf8");
  const versionPattern = new RegExp(`## \\[${versionData.version}\\]`);
  if (!changelogContent.match(versionPattern)) {
    warnings.push(
      `⚠️  Version ${versionData.version} not found in CHANGELOG.md`,
    );
  }
} else {
  warnings.push("⚠️  CHANGELOG.md not found");
}

// Check if node_modules exists and is recent
if (fs.existsSync("node_modules")) {
  const stats = fs.statSync("node_modules");
  const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld > 30) {
    warnings.push(
      "⚠️  node_modules is older than 30 days. Consider running npm install",
    );
  }
} else {
  console.error("❌ node_modules not found. Run npm install");
  hasErrors = true;
}

// Check if build directory exists (for Next.js)
if (fs.existsSync(".next")) {
  const buildStats = fs.statSync(".next");
  const buildHoursOld =
    (Date.now() - buildStats.mtime.getTime()) / (1000 * 60 * 60);
  if (buildHoursOld > 24) {
    warnings.push(
      "⚠️  Build directory is older than 24 hours. Consider rebuilding",
    );
  }
}

// Display version information
console.log("📋 Version Information:");
console.log(`   Version: ${versionData.version}`);
console.log(`   Build: ${versionData.buildNumber}`);
console.log(`   Release: ${versionData.releaseDate}`);
console.log(`   Environment: ${versionData.build.environment}`);
console.log(`   Timestamp: ${versionData.build.timestamp}`);

// Display results
console.log("\n🔍 Build Check Results:");

if (hasErrors) {
  console.log("\n❌ ERRORS FOUND:");
  console.log("   Build check failed. Please fix the errors above.");
  process.exit(1);
} else {
  console.log("\n✅ BUILD CHECK PASSED");

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:");
    warnings.forEach((warning) => console.log(`   ${warning}`));
  }

  console.log("\n🎉 Ready for build and deployment!");

  // Additional info
  console.log("\n📊 Build Statistics:");
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Architecture: ${process.arch}`);

  if (packageData.dependencies) {
    const depCount = Object.keys(packageData.dependencies).length;
    const devDepCount = packageData.devDependencies
      ? Object.keys(packageData.devDependencies).length
      : 0;
    console.log(
      `   Dependencies: ${depCount} production, ${devDepCount} development`,
    );
  }
}
