# WayruCo v1.0.0 Deployment Guide

Complete guide for deploying WayruCo to GitHub Pages with wayru.co domain on GCP DNS.

## Quick Start

```bash
# 1. Setup GCP DNS
./scripts/setup-gcp-dns.sh

# 2. Deploy to GitHub Pages
./scripts/deploy-github-pages.sh

# 3. Verify deployment
nslookup wayru.co
```

## Prerequisites

- ✅ GCP Account with billing enabled
- ✅ Domain: wayru.co (registered)
- ✅ GitHub Account with wayruco/wayruco repository
- ✅ gcloud CLI installed and authenticated
- ✅ Git configured locally

## Deployment Options

### Option 1: GitHub Pages (Recommended)

**Pros:**
- Free hosting
- Automatic HTTPS
- Built-in CI/CD
- Easy custom domain setup

**Steps:**

1. **Build static site**
   ```bash
   npm run build:static
   ```

2. **Run deployment script**
   ```bash
   ./scripts/deploy-github-pages.sh
   ```

3. **Configure GitHub Pages**
   - Go to: https://github.com/wayruco/wayruco/settings/pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Custom domain: wayru.co
   - Enforce HTTPS: ✓

4. **Verify**
   ```bash
   curl https://wayru.co
   ```

### Option 2: Vercel

**Pros:**
- Automatic deployments
- Edge functions
- Analytics included

**Steps:**

```bash
npm install -g vercel
vercel --prod
```

### Option 3: Docker + Custom Server

**Pros:**
- Full control
- Custom configurations
- Scalable

**Steps:**

```bash
# Build Docker image
docker build -t wayruco:1.0.0 .

# Run container
docker run -p 3000:3000 wayruco:1.0.0

# Deploy to server
docker push your-registry/wayruco:1.0.0
```

## DNS Configuration

### GCP Setup

1. **Create DNS Zone**
   ```bash
   gcloud dns managed-zones create wayru-co \
     --dns-name=wayru.co \
     --visibility=public
   ```

2. **Get Nameservers**
   ```bash
   gcloud dns managed-zones describe wayru-co \
     --format="value(nameServers)"
   ```

3. **Update Domain Registrar**
   - Replace nameservers with GCP nameservers
   - Wait 24-48 hours for propagation

4. **Configure Records**
   ```bash
   ./scripts/setup-gcp-dns.sh
   ```

### DNS Records

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | wayru.co | 185.199.108.153 | 3600 |
| A | wayru.co | 185.199.109.153 | 3600 |
| A | wayru.co | 185.199.110.153 | 3600 |
| A | wayru.co | 185.199.111.153 | 3600 |
| AAAA | wayru.co | 2606:4700:4700::1111 | 3600 |
| AAAA | wayru.co | 2606:4700:4700::1001 | 3600 |
| CNAME | www.wayru.co | wayruco.github.io. | 3600 |

## Verification

### DNS Resolution
```bash
# Check A records
nslookup wayru.co

# Check CNAME records
nslookup www.wayru.co

# Detailed DNS info
dig wayru.co +short
```

### HTTPS Certificate
```bash
# Check certificate
curl -I https://wayru.co

# Verify SSL
openssl s_client -connect wayru.co:443
```

### Site Accessibility
```bash
# Test homepage
curl https://wayru.co

# Test with headers
curl -I https://wayru.co

# Follow redirects
curl -L https://wayru.co
```

## Troubleshooting

### DNS Not Resolving

**Problem:** `nslookup wayru.co` returns "server can't find"

**Solutions:**
1. Wait 24-48 hours for propagation
2. Verify nameservers at registrar:
   ```bash
   nslookup -type=NS wayru.co
   ```
3. Check GCP zone:
   ```bash
   gcloud dns managed-zones describe wayru-co
   ```

### GitHub Pages Not Working

**Problem:** Site shows 404 or GitHub default page

**Solutions:**
1. Verify CNAME file exists in repository
2. Check GitHub Pages settings
3. Ensure custom domain is configured
4. Check deployment status:
   ```bash
   git log --oneline gh-pages | head -5
   ```

### HTTPS Not Working / Certificate Not Issued

**Problem:** "Enforce HTTPS — Unavailable for your site because your domain is not properly configured to support HTTPS"

**Root Cause:** GitHub Pages needs to verify DNS before issuing SSL certificate

**Solutions:**

1. **Verify DNS Configuration:**
   ```bash
   # Check A records
   dig wayru.co +short
   # Should return: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   
   # Check CNAME for www
   dig www.wayru.co +short
   # Should return: edcalderon.github.io.
   ```

2. **Verify CNAME File:**
   - File must exist at: `public/CNAME`
   - Content must be: `wayru.co` (no trailing slash)
   - Commit and push to main branch

3. **GitHub Pages Settings:**
   - Go to: https://github.com/wayruco/wayruco/settings/pages
   - Verify "Custom domain" shows: `wayru.co`
   - Wait 5-10 minutes for certificate issuance
   - Refresh page to see "Enforce HTTPS" option

4. **Force Certificate Renewal:**
   ```bash
   # Remove and re-add custom domain in GitHub Pages settings
   # This triggers certificate re-issuance
   ```

5. **Wait for DNS Propagation:**
   - Initial setup: 24-48 hours
   - Certificate issuance: 5-10 minutes after DNS verified
   - Total time: Up to 48 hours for full HTTPS

6. **Check Certificate Status:**
   ```bash
   # Verify SSL certificate
   openssl s_client -connect wayru.co:443 -servername wayru.co
   
   # Check certificate expiry
   echo | openssl s_client -servername wayru.co -connect wayru.co:443 2>/dev/null | openssl x509 -noout -dates
   ```

7. **Common Issues:**
   - DNS not fully propagated: Wait 24-48 hours
   - CNAME file missing: Add to `public/CNAME`
   - Wrong domain in settings: Verify at GitHub Pages settings
   - Repository not public: Make sure repository is public
   - Workflow not running: Check `.github/workflows/nextjs.yml` exists

### Slow DNS Propagation

**Problem:** DNS changes not visible after 24 hours

**Solutions:**
1. Flush DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemctl restart systemd-resolved
   
   # Windows
   ipconfig /flushdns
   ```

2. Use different DNS server:
   ```bash
   nslookup wayru.co 8.8.8.8
   ```

3. Check propagation:
   ```bash
   # Online tool
   https://www.whatsmydns.net/?domain=wayru.co
   ```

## Monitoring

### Health Checks

```bash
# Automated health check
watch -n 60 'curl -s -o /dev/null -w "%{http_code}" https://wayru.co'

# Monitor DNS
watch -n 300 'nslookup wayru.co'
```

### Logs

**GitHub Pages:**
- https://github.com/wayruco/wayruco/deployments

**GCP DNS:**
```bash
gcloud logging read "resource.type=dns_query" --limit 50
```

## Rollback

### Revert Deployment

```bash
# Go back to previous commit
git revert HEAD

# Force push to gh-pages
git push origin gh-pages --force
```

### Restore DNS

```bash
# Delete record
gcloud dns record-sets delete wayru.co \
  --type=A \
  --zone=wayru-co

# Recreate with old values
gcloud dns record-sets create wayru.co \
  --rrdatas=OLD_IP \
  --type=A \
  --zone=wayru-co
```

## Performance Optimization

### CDN Configuration

GitHub Pages uses Fastly CDN automatically. To optimize:

1. **Cache Headers**
   - Static assets: 1 year
   - HTML: 1 hour
   - API: No cache

2. **Compression**
   - Enable gzip (automatic)
   - Minify assets (done in build)

3. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Responsive images

### Monitoring Performance

```bash
# Page load time
curl -w "@curl-format.txt" -o /dev/null -s https://wayru.co

# Lighthouse score
lighthouse https://wayru.co --view
```

## Security

### HTTPS Enforcement

✅ Automatic via GitHub Pages

### Security Headers

Add to GitHub Pages (via repository settings):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### DNS Security

Enable DNSSEC (optional):

```bash
gcloud dns managed-zones update wayru-co --dnssec-state on
```

## Maintenance

### Regular Tasks

- [ ] Monitor DNS health weekly
- [ ] Check certificate expiration monthly
- [ ] Review deployment logs monthly
- [ ] Update dependencies quarterly
- [ ] Test disaster recovery semi-annually

### Update Deployment

```bash
# Build new version
npm run build:static

# Deploy
./scripts/deploy-github-pages.sh

# Verify
curl https://wayru.co
```

## Support & Resources

### Documentation
- [GCP DNS Docs](https://cloud.google.com/dns/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [DNS Setup Guide](./DNS_SETUP_GUIDE.md)

### Contact
- Email: hello@wayru.co
- GitHub: https://github.com/wayruco/wayruco
- Issues: https://github.com/wayruco/wayruco/issues

## Deployment Checklist

- [ ] Build static site: `npm run build:static`
- [ ] Create GCP DNS zone: `./scripts/setup-gcp-dns.sh`
- [ ] Update domain registrar nameservers
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Configure GitHub Pages custom domain
- [ ] Deploy to GitHub Pages: `./scripts/deploy-github-pages.sh`
- [ ] Verify DNS resolution: `nslookup wayru.co`
- [ ] Test HTTPS: `curl https://wayru.co`
- [ ] Monitor deployment status
- [ ] Announce release

---

**Version**: 1.0.0  
**Last Updated**: December 31, 2025  
**Status**: Production Ready
