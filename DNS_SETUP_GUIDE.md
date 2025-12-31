# WayruCo DNS Setup Guide for GCP

## Overview
This guide sets up the wayru.co domain on Google Cloud Platform (GCP) to point to GitHub Pages for the WayruCo frontend deployment.

## Prerequisites
- GCP Project with billing enabled
- Domain: wayru.co (already registered)
- GitHub Pages repository: wayruco/wayruco
- GCP Service Account with DNS admin permissions
- gcloud CLI installed

## Step 1: Create GCP DNS Zone

### Via GCP Console
1. Go to Cloud Console → Cloud DNS
2. Click "Create Zone"
3. Configure:
   - **Zone Name**: wayru-co
   - **DNS Name**: wayru.co
   - **Type**: Public
   - **DNSSEC**: Off (for now)
   - **Cloud Logging**: Off (optional)
4. Click "Create"

### Via gcloud CLI
```bash
gcloud dns managed-zones create wayru-co \
  --dns-name=wayru.co \
  --description="WayruCo DNS Zone" \
  --visibility=public
```

## Step 2: Get GCP Nameservers

After zone creation, note the 4 nameservers assigned by GCP:

```bash
gcloud dns managed-zones describe wayru-co --format="value(nameServers)"
```

Example output:
```
ns-123.googledomains.com.
ns-456.googledomains.com.
ns-789.googledomains.com.
ns-012.googledomains.com.
```

## Step 3: Update Domain Registrar

1. Go to your domain registrar (where wayru.co is registered)
2. Update nameservers to the 4 GCP nameservers
3. Wait 24-48 hours for DNS propagation

## Step 4: Configure DNS Records for GitHub Pages

### A Records (for root domain)
GitHub Pages IP addresses:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

```bash
# Add A records
gcloud dns record-sets create wayru.co \
  --rrdatas=185.199.108.153,185.199.109.153,185.199.110.153,185.199.111.153 \
  --ttl=3600 \
  --type=A \
  --zone=wayru-co

# Add AAAA records (IPv6)
gcloud dns record-sets create wayru.co \
  --rrdatas=2606:4700:4700::1111,2606:4700:4700::1001 \
  --ttl=3600 \
  --type=AAAA \
  --zone=wayru-co
```

### CNAME Record (for www subdomain)
```bash
gcloud dns record-sets create www.wayru.co \
  --rrdatas=wayruco.github.io. \
  --ttl=3600 \
  --type=CNAME \
  --zone=wayru-co
```

### MX Records (for email - optional)
```bash
gcloud dns record-sets create wayru.co \
  --rrdatas="10 aspmx.l.google.com.,20 alt1.aspmx.l.google.com." \
  --ttl=3600 \
  --type=MX \
  --zone=wayru-co
```

### TXT Records (for verification - optional)
```bash
# Google verification
gcloud dns record-sets create wayru.co \
  --rrdatas="v=spf1 include:_spf.google.com ~all" \
  --ttl=3600 \
  --type=TXT \
  --zone=wayru-co
```

## Step 5: Configure GitHub Pages

1. Go to GitHub repository: wayruco/wayruco
2. Settings → Pages
3. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: main (or gh-pages)
   - **Custom domain**: wayru.co
   - **Enforce HTTPS**: ✓ (checked)

## Step 6: Verify DNS Configuration

```bash
# Check A records
nslookup wayru.co

# Check CNAME records
nslookup www.wayru.co

# Check all records
gcloud dns record-sets list --zone=wayru-co

# Verify GitHub Pages
dig wayru.co +short
```

Expected output for A records:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## Step 7: Enable HTTPS

1. GitHub Pages automatically provisions SSL certificate
2. Wait 5-10 minutes for certificate issuance
3. Verify HTTPS works: https://wayru.co

## Complete DNS Records Summary

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | wayru.co | 185.199.108.153 | 3600 |
| A | wayru.co | 185.199.109.153 | 3600 |
| A | wayru.co | 185.199.110.153 | 3600 |
| A | wayru.co | 185.199.111.153 | 3600 |
| AAAA | wayru.co | 2606:4700:4700::1111 | 3600 |
| AAAA | wayru.co | 2606:4700:4700::1001 | 3600 |
| CNAME | www.wayru.co | wayruco.github.io. | 3600 |
| MX | wayru.co | 10 aspmx.l.google.com. | 3600 |
| TXT | wayru.co | v=spf1 include:_spf.google.com ~all | 3600 |

## Troubleshooting

### DNS not resolving
- Wait 24-48 hours for propagation
- Verify nameservers are updated at registrar
- Check: `nslookup -type=NS wayru.co`

### GitHub Pages not working
- Verify custom domain in GitHub settings
- Check CNAME file in repository root
- Ensure HTTPS is enabled

### Email not working
- Verify MX records are correct
- Check SPF/DKIM/DMARC records
- Use: `nslookup -type=MX wayru.co`

## Useful Commands

```bash
# List all DNS zones
gcloud dns managed-zones list

# Describe zone
gcloud dns managed-zones describe wayru-co

# List all records in zone
gcloud dns record-sets list --zone=wayru-co

# Delete a record
gcloud dns record-sets delete wayru.co \
  --rrdatas=185.199.108.153 \
  --ttl=3600 \
  --type=A \
  --zone=wayru-co

# Update TTL
gcloud dns record-sets update wayru.co \
  --rrdatas=185.199.108.153,185.199.109.153,185.199.110.153,185.199.111.153 \
  --ttl=300 \
  --type=A \
  --zone=wayru-co
```

## Security Considerations

1. **DNSSEC**: Enable for enhanced security (optional)
   ```bash
   gcloud dns managed-zones update wayru-co --dnssec-state on
   ```

2. **Cloud Logging**: Enable for audit trail (optional)
   ```bash
   gcloud dns managed-zones update wayru-co --enable-logging
   ```

3. **IAM Permissions**: Restrict DNS zone access
   ```bash
   gcloud dns managed-zones add-iam-policy-binding wayru-co \
     --member=serviceAccount:edward@lsts.tech \
     --role=roles/dns.admin
   ```

## Next Steps

1. ✅ Create GCP DNS Zone
2. ✅ Configure DNS Records
3. ✅ Update Domain Registrar
4. ✅ Configure GitHub Pages
5. ✅ Verify DNS Resolution
6. ✅ Enable HTTPS
7. ✅ Monitor DNS Health

## Support

For issues:
- GCP DNS Documentation: https://cloud.google.com/dns/docs
- GitHub Pages Documentation: https://docs.github.com/en/pages
- Email: hello@wayru.co

---

**Last Updated**: December 31, 2025
**Status**: Ready for Implementation
