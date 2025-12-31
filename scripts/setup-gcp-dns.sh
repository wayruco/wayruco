#!/bin/bash

# WayruCo GCP DNS Setup Script
# Configures DNS zone and records for wayru.co on Google Cloud Platform

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
ZONE_NAME="wayru-co"
DOMAIN="wayru.co"
PROJECT_ID="${GCP_PROJECT_ID:-}"
SERVICE_ACCOUNT="${SERVICE_ACCOUNT:-edward@lsts.tech}"

# GitHub Pages IPs
GITHUB_A_RECORDS=(
  "185.199.108.153"
  "185.199.109.153"
  "185.199.110.153"
  "185.199.111.153"
)

GITHUB_AAAA_RECORDS=(
  "2606:4700:4700::1111"
  "2606:4700:4700::1001"
)

echo -e "${BLUE}🌐 WayruCo GCP DNS Setup${NC}"
echo "=================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
  echo "Visit: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

echo -e "${BLUE}Step 1: Checking GCP authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo -e "${YELLOW}⚠️  Not authenticated. Please run: gcloud auth login${NC}"
  exit 1
fi

CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
echo -e "${GREEN}✓ Authenticated as: $CURRENT_ACCOUNT${NC}"

echo ""
echo -e "${BLUE}Step 2: Setting up GCP project...${NC}"

if [ -z "$PROJECT_ID" ]; then
  PROJECT_ID=$(gcloud config get-value project)
  if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No GCP project set. Please run: gcloud config set project PROJECT_ID${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✓ Using project: $PROJECT_ID${NC}"

echo ""
echo -e "${BLUE}Step 3: Creating DNS zone...${NC}"

if gcloud dns managed-zones describe $ZONE_NAME --project=$PROJECT_ID &> /dev/null; then
  echo -e "${YELLOW}⚠️  Zone '$ZONE_NAME' already exists${NC}"
else
  echo "Creating zone..."
  gcloud dns managed-zones create $ZONE_NAME \
    --dns-name=$DOMAIN \
    --description="WayruCo DNS Zone for $DOMAIN" \
    --visibility=public \
    --project=$PROJECT_ID
  echo -e "${GREEN}✓ Zone created${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Getting nameservers...${NC}"
NAMESERVERS=$(gcloud dns managed-zones describe $ZONE_NAME \
  --format="value(nameServers)" \
  --project=$PROJECT_ID)

echo -e "${GREEN}✓ Nameservers:${NC}"
echo "$NAMESERVERS" | while read ns; do
  echo "  - $ns"
done

echo ""
echo -e "${YELLOW}⚠️  Update your domain registrar with these nameservers!${NC}"
echo ""

echo -e "${BLUE}Step 5: Configuring A records (IPv4)...${NC}"

# Build rrdatas string
A_RRDATAS=$(IFS=,; echo "${GITHUB_A_RECORDS[*]}")

if gcloud dns record-sets describe $DOMAIN --type=A --zone=$ZONE_NAME --project=$PROJECT_ID &> /dev/null; then
  echo "Updating A records..."
  gcloud dns record-sets update $DOMAIN \
    --rrdatas=$A_RRDATAS \
    --ttl=3600 \
    --type=A \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
else
  echo "Creating A records..."
  gcloud dns record-sets create $DOMAIN \
    --rrdatas=$A_RRDATAS \
    --ttl=3600 \
    --type=A \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
fi

echo -e "${GREEN}✓ A records configured${NC}"

echo ""
echo -e "${BLUE}Step 6: Configuring AAAA records (IPv6)...${NC}"

# Build rrdatas string
AAAA_RRDATAS=$(IFS=,; echo "${GITHUB_AAAA_RECORDS[*]}")

if gcloud dns record-sets describe $DOMAIN --type=AAAA --zone=$ZONE_NAME --project=$PROJECT_ID &> /dev/null; then
  echo "Updating AAAA records..."
  gcloud dns record-sets update $DOMAIN \
    --rrdatas=$AAAA_RRDATAS \
    --ttl=3600 \
    --type=AAAA \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
else
  echo "Creating AAAA records..."
  gcloud dns record-sets create $DOMAIN \
    --rrdatas=$AAAA_RRDATAS \
    --ttl=3600 \
    --type=AAAA \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
fi

echo -e "${GREEN}✓ AAAA records configured${NC}"

echo ""
echo -e "${BLUE}Step 7: Configuring CNAME record for www...${NC}"

if gcloud dns record-sets describe www.$DOMAIN --type=CNAME --zone=$ZONE_NAME --project=$PROJECT_ID &> /dev/null; then
  echo "Updating CNAME record..."
  gcloud dns record-sets update www.$DOMAIN \
    --rrdatas=wayruco.github.io. \
    --ttl=3600 \
    --type=CNAME \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
else
  echo "Creating CNAME record..."
  gcloud dns record-sets create www.$DOMAIN \
    --rrdatas=wayruco.github.io. \
    --ttl=3600 \
    --type=CNAME \
    --zone=$ZONE_NAME \
    --project=$PROJECT_ID
fi

echo -e "${GREEN}✓ CNAME record configured${NC}"

echo ""
echo -e "${BLUE}Step 8: Listing all DNS records...${NC}"
echo ""
gcloud dns record-sets list --zone=$ZONE_NAME --project=$PROJECT_ID

echo ""
echo -e "${GREEN}=================================="
echo "✅ DNS Setup Complete!"
echo "==================================${NC}"
echo ""
echo "📋 Summary:"
echo "  Zone: $ZONE_NAME"
echo "  Domain: $DOMAIN"
echo "  Project: $PROJECT_ID"
echo ""
echo "🔧 Next steps:"
echo "  1. Update nameservers at your domain registrar"
echo "  2. Wait 24-48 hours for DNS propagation"
echo "  3. Configure GitHub Pages: https://github.com/wayruco/wayruco/settings/pages"
echo "  4. Run deployment script: ./scripts/deploy-github-pages.sh"
echo ""
echo "✅ Verification commands:"
echo "  nslookup $DOMAIN"
echo "  nslookup www.$DOMAIN"
echo "  dig $DOMAIN +short"
echo ""
echo "📚 Documentation: DNS_SETUP_GUIDE.md"
echo ""
