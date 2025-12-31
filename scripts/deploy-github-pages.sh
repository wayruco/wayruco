#!/bin/bash

# WayruCo GitHub Pages Deployment Script
# Deploys the static build to GitHub Pages

set -e

echo "🚀 WayruCo GitHub Pages Deployment"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/wayruco/wayruco.git"
BRANCH="main"
BUILD_DIR="out"
DEPLOY_BRANCH="gh-pages"

echo -e "${BLUE}Step 1: Building static site...${NC}"
npm run build:static

if [ ! -d "$BUILD_DIR" ]; then
  echo -e "${YELLOW}Error: Build directory '$BUILD_DIR' not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Build complete${NC}"

echo -e "${BLUE}Step 2: Creating CNAME file...${NC}"
echo "wayru.co" > "$BUILD_DIR/CNAME"
echo -e "${GREEN}✓ CNAME file created${NC}"

echo -e "${BLUE}Step 3: Preparing deployment...${NC}"

# Check if gh-pages branch exists
if git rev-parse --verify gh-pages > /dev/null 2>&1; then
  echo -e "${YELLOW}gh-pages branch exists, updating...${NC}"
  git checkout gh-pages
  git pull origin gh-pages
else
  echo -e "${YELLOW}Creating new gh-pages branch...${NC}"
  git checkout --orphan gh-pages
fi

echo -e "${BLUE}Step 4: Copying build files...${NC}"
# Remove all files except .git
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Copy build files
cp -r "$BUILD_DIR"/* .
cp "$BUILD_DIR/CNAME" .

echo -e "${GREEN}✓ Files copied${NC}"

echo -e "${BLUE}Step 5: Committing changes...${NC}"
git add -A
git commit -m "chore: Deploy WayruCo v1.0.0 to GitHub Pages

- Build: $(date +%Y-%m-%d\ %H:%M:%S)
- Branch: $BRANCH
- CNAME: wayru.co"

echo -e "${GREEN}✓ Changes committed${NC}"

echo -e "${BLUE}Step 6: Pushing to GitHub...${NC}"
git push origin gh-pages --force

echo -e "${GREEN}✓ Pushed to GitHub${NC}"

echo -e "${BLUE}Step 7: Returning to main branch...${NC}"
git checkout $BRANCH

echo -e "${GREEN}✓ Returned to main branch${NC}"

echo ""
echo -e "${GREEN}=================================="
echo "✅ Deployment Complete!"
echo "==================================${NC}"
echo ""
echo "📍 Site URL: https://wayru.co"
echo "📍 GitHub Pages: https://wayruco.github.io"
echo ""
echo "⏱️  DNS propagation may take 24-48 hours"
echo "🔒 HTTPS will be enabled automatically"
echo ""
echo "Next steps:"
echo "1. Verify DNS records: nslookup wayru.co"
echo "2. Check GitHub Pages settings"
echo "3. Monitor deployment at: https://github.com/wayruco/wayruco/deployments"
echo ""
