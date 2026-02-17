# 🚀 Setup Guide - Sonawale Bullion Registry

## ✅ Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**

## 📦 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The `.env.local` file has been configured with:

#### Database (Turso/LibSQL)
- ✅ `TURSO_DATABASE_URL` - Connected to AWS AP-South-1 region
- ✅ `TURSO_AUTH_TOKEN` - Authentication configured
- ✅ Vite-prefixed variables for browser access

#### Cloud Storage (Cloudflare R2)
- ✅ `R2_ENDPOINT` - Storage endpoint
- ✅ `R2_BUCKET_NAME` - `telugu-sonawale`
- ✅ `R2_PUBLIC_URL` - CDN URL for images

#### Admin Access
- ⚠️ `ADMIN_ID` - Default: `8886575507`
- ⚠️ `ADMIN_PASSWORD` - **CHANGE THIS IN PRODUCTION!**

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

---

## 🔐 Security Checklist

- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Never commit `.env.local` to version control (already in `.gitignore`)
- [ ] For production deployment, set environment variables in your hosting platform

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `R2_ENDPOINT`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
   - `ADMIN_ID`
   - `ADMIN_PASSWORD`

4. Deploy!

### Manual Deployment

1. Build: `npm run build`
2. Serve the `dist/` folder with any static host
3. Ensure environment variables are configured

---

## 🧪 Testing Database Connection

The app will automatically:
- Initialize database tables on first run
- Show connection status in the Admin Portal
- Display "DB: CONNECTED" indicator when successful

---

## 📝 Admin Portal Access

1. Navigate to the homepage
2. Scroll to sidebar → Click **"లాగిన్ / REPORTER ACCESS"**
3. Enter credentials:
   - **Reporter ID:** `8886575507` (or your custom ADMIN_ID)
   - **Passkey:** Your configured password

---

## 🗄️ Database Schema

The app auto-creates these tables:

### `articles`
- `id` - Auto-increment primary key
- `title`, `slug`, `summary`, `content`
- `author_handle`, `featured_image`, `image_alt`
- `date`, `focus_keywords`

### `price_history`
- `id` - Auto-increment primary key
- `gold24k`, `gold22k`, `silver` (prices)
- `timestamp` - Auto-generated

---

## 🖼️ Image Upload

Images are:
1. Converted to WebP format (client-side)
2. Uploaded to Cloudflare R2
3. Served via public CDN URL

If R2 upload fails, you can use "Direct DB Upload" to publish articles without images.

---

## 🐛 Troubleshooting

### "DB: OFFLINE" in Admin Portal

**Possible causes:**
- Missing environment variables
- Invalid database URL
- Network connectivity issues

**Solution:**
1. Check `.env.local` has correct `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
2. Restart dev server: `npm run dev`

### "R2 Upload Failed"

**Possible causes:**
- CORS not configured on R2 bucket
- Invalid endpoint URL
- Network issues

**Solution:**
1. Verify R2 bucket allows public uploads (or use pre-signed URLs)
2. Use "Direct DB Upload" as fallback

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Project Structure

```
d:\Users\Mr\Desktop\New folder\
├── App.tsx              # Main application component
├── index.tsx            # Entry point
├── components/          # React components
│   ├── AuthorPortal.tsx # Admin CMS
│   ├── PriceTicker.tsx  # Live price display
│   └── ...
├── lib/                 # Utilities
│   ├── db.ts           # Database functions
│   ├── storage.ts      # R2 image upload
│   └── ...
├── constants.ts         # App configuration
├── types.ts            # TypeScript types
├── .env.local          # Environment variables (not in git)
└── package.json        # Dependencies
```

---

## ✨ Features

- 📱 Responsive Telugu/English bilingual UI
- 📊 Live gold & silver price tracking
- 📈 7-day price trend visualization
- ✍️ Admin CMS for publishing articles
- 🖼️ WebP image optimization
- 🔍 SEO-optimized with structured data
- 📡 RSS feed & sitemap generation

---

**Ready to go!** 🎉
