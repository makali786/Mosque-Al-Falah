# Cloudinary Optimization Guide

## ✅ Cloudinary is Now Re-enabled with Optimizations

Your Cloudinary account has been re-enabled with several optimizations to reduce credit usage and improve performance.

---

## 🔧 Optimizations Applied

### 1. Image Format Optimization (`f_auto`)
```typescript
fetch_format: 'auto'
```
- Automatically serves WebP or AVIF to supported browsers
- **Reduces file size by 25-35%** compared to JPEG/PNG
- Falls back to JPEG for older browsers

### 2. Quality Optimization (`q_auto:good`)
```typescript
quality: 'auto:good'
```
- Automatically adjusts quality based on image content
- **Reduces file size by 15-25%** with minimal visual loss
- Uses less bandwidth = fewer credits consumed

### 3. Device Pixel Ratio (`dpr_auto`)
```typescript
dpr: 'auto'
```
- Serves appropriate resolution for device (1x, 2x, 3x)
- Prevents downloading oversized images on mobile
- **Reduces mobile bandwidth by 30-50%**

### 4. Eager Transformations (On Upload)
```typescript
eager: [
  { width: 1920, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
  { width: 1200, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
  { width: 800, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
]
```
- Pre-generates optimized versions on upload
- Faster delivery (no on-the-fly transformation)
- Uses "limit" crop to preserve aspect ratio

### 5. Next.js Image Caching
```typescript
minimumCacheTTL: 86400 // 24 hours
```
- Images cached for 24 hours
- Reduces repeated requests for same images

---

## 📊 Expected Credit Savings

| Optimization | Estimated Savings |
|--------------|-------------------|
| `f_auto` (WebP/AVIF) | 25-35% |
| `q_auto:good` | 15-25% |
| `dpr_auto` | 20-30% |
| Combined | **50-70% reduction** |

### Before vs After

| Metric | Before | After (Optimized) |
|--------|--------|-------------------|
| Credits for 1,000 page views | ~20 | ~6-10 |
| Average image size | 500 KB | 200-300 KB |
| Mobile bandwidth | High | Optimized |

---

## 📁 Files Modified

| File | Change |
|------|--------|
| `payload.config.ts` | Re-enabled Cloudinary plugin |
| `collections/Media.ts` | Set `disableLocalStorage: true` |
| `next.config.ts` | Added Cloudinary to remotePatterns |
| `lib/cloudinaryAdapter.ts` | Added optimization parameters |

---

## 🔍 Monitoring Your Usage

### Check Usage Regularly
1. Go to: https://cloudinary.com/console
2. Navigate to: **Dashboard** → **Usage**
3. Monitor:
   - **Transformations**: Keep under your plan limit
   - **Storage**: Monitor total storage used
   - **Bandwidth**: Track data transfer

### Set Up Alerts
1. In Cloudinary Console → **Settings** → **Notifications**
2. Set alerts at:
   - **75%** of credit limit (warning)
   - **90%** of credit limit (critical)

---

## 💡 Best Practices to Minimize Credits

### 1. Reuse Images
- Don't upload duplicates
- Check if image exists before uploading

### 2. Optimize Before Upload
- Compress images before uploading (use TinyPNG, Squoosh)
- Recommended: JPEG 80% quality, max 1920px width

### 3. Use Appropriate Sizes
- Don't upload 4000px images for thumbnails
- Upload once, let Cloudinary resize

### 4. Cache Headers
Your config already includes:
```typescript
minimumCacheTTL: 86400 // 24 hours
```

### 5. Avoid Frequent Re-uploads
- Each upload consumes credits
- Batch uploads when possible

---

## 🚨 Troubleshooting

### Images Not Loading?
1. Check Cloudinary Console for errors
2. Verify environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=dzoatqo2u
   CLOUDINARY_API_KEY=292672151373435
   CLOUDINARY_API_SECRET=***
   ```
3. Check Vercel logs: `vercel logs --all`

### High Credit Usage Still?
1. Check for image hotlinking (other sites using your images)
2. Add domain restrictions in Cloudinary settings
3. Consider adding a CDN (Cloudflare) in front

---

## 📞 Need Help?

| Issue | Contact |
|-------|---------|
| Cloudinary billing | support@cloudinary.com |
| Technical issues | https://support.cloudinary.com |
| Payload CMS | https://payloadcms.com/community |

---

## 🔄 Quick Commands

```bash
# Test image optimization
curl -I "https://res.cloudinary.com/dzoatqo2u/image/upload/f_auto,q_auto/sample.jpg"

# Check your Cloudinary usage
# Visit: https://cloudinary.com/console

# Deploy with new config
vercel --prod
```

---

## 📈 Plan Recommendations

Based on your usage (364 images, ~10-20 per page):

| Plan | Credits | Best For |
|------|---------|----------|
| Free | 25/mo | Testing only (you exceeded this) |
| Plus | $25/mo | Your current plan - good for ~5,000 page views/mo |
| Advanced | $89/mo | High traffic sites |

---

*Last updated: 2026-04-01*
*Cloudinary account: dzoatqo2u*
