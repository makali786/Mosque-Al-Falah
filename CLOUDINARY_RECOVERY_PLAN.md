# Cloudinary Account Recovery Plan

## 🔴 Current Status
- **Cloudinary Account**: DISABLED (405% credit usage - 101/25 credits)
- **Images in Cloudinary**: 364 files (INACCESSIBLE)
- **Local Images**: 191 UI assets (available)
- **Impact**: All user-uploaded images (banners, events, imam photos) are broken

## ✅ Immediate Fixes Applied

### 1. Disabled Cloudinary Integration
- **File**: `payload.config.ts`
- Cloudinary plugin commented out
- Media uploads will now use **local storage** temporarily

### 2. Enabled Local Storage
- **File**: `collections/Media.ts`
- `disableLocalStorage: false`
- Uploads saved to `/media` folder

### 3. Updated Next.js Config
- **File**: `next.config.ts`
- Removed Cloudinary from remotePatterns

---

## 📋 Recovery Steps (Choose One)

### Option A: Contact Cloudinary Support (FREE)

**Email Template:**
```
Subject: Account Reactivation Request for Non-Profit Mosque

Dear Cloudinary Support,

Our mosque's Cloudinary account was disabled due to exceeding 
the free plan limit. We need temporary access to download our 
media files for migration.

Account: dzoatqo2u
Email: masjid@masjid-alfalah.org.uk
Images: 364 files

Please reactivate for 48 hours or provide a download link.
```

**Contact:**
- support@cloudinary.com
- https://support.cloudinary.com

---

### Option B: Temporary Upgrade ($25)

1. Go to: https://cloudinary.com/console
2. Upgrade to **Plus Plan** ($25/month)
3. Download all your media (use script below)
4. Cancel subscription after download

**Download Script (after reactivation):**
```bash
npx tsx scripts/backup-cloudinary.ts
```

---

### Option C: Migrate to Vercel Blob (Recommended Long-term)

You already have `BLOB_READ_WRITE_TOKEN` in your `.env`.

**Steps:**
1. Recover files from Cloudinary (Option A or B first)
2. Run migration script:
   ```bash
   npx tsx scripts/migrate-media-to-vercel-blob.ts
   ```
3. Update `payload.config.ts` to use Vercel Blob adapter

---

## 🔧 To Re-enable Cloudinary (After Recovery)

### 1. Update `payload.config.ts`:
```typescript
plugins: [
  cloudStoragePlugin({
    collections: {
      media: {
        adapter: cloudinaryAdapter({
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
          apiKey: process.env.CLOUDINARY_API_KEY || '',
          apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        }),
      },
    },
  }),
],
```

### 2. Update `collections/Media.ts`:
```typescript
upload: {
  disableLocalStorage: true,
},
```

### 3. Update `next.config.ts`:
Add Cloudinary back to `remotePatterns`.

---

## 📊 Credit Usage Analysis

### Why Credits Were Exhausted:
- Free plan: 25 credits/month (~25,000 requests)
- Your site: ~10-20 images per page
- Just **1,250 page views** = 25,000 image requests
- Development/testing also consumes credits

### Prevention Tips:
1. **Enable caching** (done in `lib/cloudinaryAdapter.ts`)
2. **Use a CDN** (Cloudflare in front of Cloudinary)
3. **Monitor usage** weekly
4. **Set up alerts** at 80% usage
5. **Consider Vercel Blob** (no request-based billing)

---

## 📁 Backup Files Created

| File | Purpose |
|------|---------|
| `media-urls-export.json` | List of all 364 media files with URLs |
| `scripts/backup-media.ps1` | Windows script to download files |
| `scripts/backup-cloudinary.ts` | TypeScript backup script |
| `cloudinary-backup/` | Folder for downloaded files |

---

## ⚡ Quick Commands

```bash
# Check local media folder
ls media/

# Run development server
npm run dev

# Build (local files will be included)
npm run build

# Extract media URLs (already done)
npx tsx scripts/extract-media-urls.ts
```

---

## 📞 Support Contacts

| Service | Contact |
|---------|---------|
| Cloudinary | support@cloudinary.com |
| Vercel | support@vercel.com |
| Payload CMS | https://payloadcms.com/community |

---

## ⏰ Timeline

- **Immediate**: Site uses local storage (new uploads work)
- **Day 1-2**: Contact Cloudinary support
- **Day 3-7**: Download backup or upgrade temporarily
- **Week 1-2**: Migrate to permanent solution (Vercel Blob)

---

*Last updated: 2026-04-01*
