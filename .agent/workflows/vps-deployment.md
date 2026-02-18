# VPS Deployment Guide — Mosque Al-Falah

Complete guide to deploy your Next.js + Payload CMS app on a VPS for maximum speed in the UK.

---

## Step 1: Buy a VPS

**Recommended providers (UK-optimized):**

| Provider          | Plan          | Specs                     | Price    | Location                      |
| ----------------- | ------------- | ------------------------- | -------- | ----------------------------- |
| **DigitalOcean**  | Basic Droplet | 2 vCPU, 4GB RAM, 80GB SSD | $24/mo   | **London** 🇬🇧                 |
| **Hetzner Cloud** | CX22          | 2 vCPU, 4GB RAM, 40GB SSD | €5.49/mo | Falkenstein, DE (~20ms to UK) |
| **Vultr**         | Cloud Compute | 2 vCPU, 4GB RAM, 80GB SSD | $24/mo   | **London** 🇬🇧                 |

> [!TIP]
> For absolute lowest latency to UK users, pick DigitalOcean or Vultr with the **London** datacenter. Hetzner is cheapest but adds ~20ms.

**When creating the VPS:**

- OS: **Ubuntu 22.04 LTS**
- Enable SSH key authentication
- Note the server IP address

---

## Step 2: Domain DNS Setup (via Cloudflare)

1. Create a free Cloudflare account at [cloudflare.com](https://cloudflare.com)
2. Add your domain `masjid-alfalah.org.uk`
3. Point your nameservers to Cloudflare (your registrar's DNS settings)
4. Add DNS records:

```
Type    Name    Value           Proxy
A       @       YOUR_VPS_IP     ☁️ Proxied
A       www     YOUR_VPS_IP     ☁️ Proxied
```

5. Enable these Cloudflare settings:
   - **SSL/TLS** → Full (strict)
   - **Speed → Optimization** → Enable Auto Minify (JS, CSS, HTML)
   - **Caching** → Browser Cache TTL: 4 hours
   - **Page Rules** → Cache Level: Standard

---

## Step 3: Server Setup

SSH into your VPS and run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should be v20.x
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Certbot for SSL (optional, Cloudflare handles SSL)
sudo apt install -y certbot python3-certbot-nginx

# Install Git
sudo apt install -y git
```

---

## Step 4: Clone and Build

```bash
# Create app directory
sudo mkdir -p /var/www/mosque
sudo chown $USER:$USER /var/www/mosque

# Clone your repo
cd /var/www/mosque
git clone https://github.com/YOUR_REPO/Mosque-Al-Falah.git .

# Install dependencies
npm install

# Create .env file (copy your local .env and adjust)
nano .env
```

**Key `.env` changes for VPS:**

```env
# Change NEXTAUTH_URL to your domain
NEXTAUTH_URL=https://masjid-alfalah.org.uk

# Keep your existing MongoDB Atlas connection
DATABASE_URL=mongodb+srv://mosque-admin:mosque123@cluster0.oggca09.mongodb.net/mosque-al-falah

# Keep existing Stripe, Cloudinary, etc.
# Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY if not already set
```

```bash
# Build the app
npm run build

# Test it runs
npm run start  # Should start on port 3000
# Ctrl+C to stop
```

---

## Step 5: PM2 Setup

```bash
# Start with PM2
cd /var/www/mosque
pm2 start npm --name "mosque" -- start

# Set PM2 to auto-start on reboot
pm2 startup
pm2 save

# Useful PM2 commands:
# pm2 logs mosque      — View logs
# pm2 restart mosque   — Restart app
# pm2 stop mosque      — Stop app
# pm2 monit            — Monitor CPU/memory
```

---

## Step 6: Nginx Reverse Proxy

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/mosque
```

Paste this config:

```nginx
server {
    listen 80;
    server_name masjid-alfalah.org.uk www.masjid-alfalah.org.uk;

    # Redirect HTTP to HTTPS (Cloudflare handles SSL)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase timeouts for Payload admin
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;

        # Increase body size for media uploads
        client_max_body_size 50M;
    }

    # Cache static assets aggressively
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

Enable and restart Nginx:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/mosque /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Step 7: Auto-Deploy Script

Create a deploy script on the server:

```bash
nano /var/www/mosque/deploy.sh
```

```bash
#!/bin/bash
set -e

echo "🔄 Deploying Mosque Al-Falah..."

cd /var/www/mosque

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Build
npm run build

# Restart PM2
pm2 restart mosque

echo "✅ Deployment complete!"
```

```bash
chmod +x /var/www/mosque/deploy.sh
```

To deploy updates, just SSH in and run:

```bash
/var/www/mosque/deploy.sh
```

---

## Step 8: GitHub Actions Auto-Deploy (Optional)

Create `.github/workflows/deploy.yml` in your repo:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: /var/www/mosque/deploy.sh
```

Add these secrets in GitHub → Settings → Secrets:

- `VPS_HOST` — Your server IP
- `VPS_USER` — `root` or your username
- `VPS_SSH_KEY` — Your SSH private key

Now every push to `main` auto-deploys!

---

## Performance Expectations

| Metric                | Vercel (Free)           | VPS (UK)                   |
| --------------------- | ----------------------- | -------------------------- |
| TTFB (UK users)       | 200-500ms               | **50-100ms**               |
| CMS update reflection | 60s (with revalidation) | **Instant** (same process) |
| Cold start            | 1-3s (serverless)       | **None** (always warm)     |
| Media upload          | Via Vercel Blob         | Via Cloudinary (same)      |
| Monthly cost          | Free                    | €5-24/mo                   |

> [!IMPORTANT]
> On a VPS, Payload CMS and Next.js run in the **same process**. When you save content in the admin, the `afterChange` hooks call `revalidatePath()` in the same Node.js instance — making updates truly **instant** (no network round-trip).
