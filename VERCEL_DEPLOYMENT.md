# Vercel Deployment Configuration for Sonawale

## Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Environment Variables

Set these in Vercel Project Settings → Environment Variables:

### Database (Required)
```
TURSO_DATABASE_URL=libsql://telugu-sonwale-vercel-icfg-fctpkxnw9kfbyxywrghysj9s.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=<your-token>
VITE_TURSO_URL=libsql://telugu-sonwale-vercel-icfg-fctpkxnw9kfbyxywrghysj9s.aws-ap-south-1.turso.io
VITE_TURSO_AUTH_TOKEN=<your-token>
```

### Cloud Storage (Required)
```
R2_ENDPOINT=https://d2ee658194859b79564077fad96456cc.r2.cloudflarestorage.com
R2_BUCKET_NAME=telugu-sonawale
R2_PUBLIC_URL=https://pub-0a5d163a427242319da103daaf44fbf3.r2.dev
VITE_R2_PUBLIC_URL=https://pub-0a5d163a427242319da103daaf44fbf3.r2.dev
```

### Admin Credentials (Required - SET NEW VALUES)
```
ADMIN_ID=<your-admin-id>
ADMIN_PASSWORD=<your-strong-password>
VITE_ADMIN_ID=<your-admin-id>
VITE_ADMIN_PASSWORD=<your-strong-password>
```

### Optional
```
GEMINI_API_KEY=<if-using-ai-features>
```

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the project
4. Vercel will auto-detect Vite

### 3. Configure Environment
1. Go to Project Settings → Environment Variables
2. Add all variables listed above
3. Set for Production, Preview, and Development

### 4. Deploy
Click "Deploy" - Vercel will:
1. Install dependencies
2. Run `npm run build`
3. Deploy the `dist` folder
4. Assign a production URL

### 5. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add `telu gu.sonawale.com`
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

## Auto-Deployment
Every push to `main` branch will automatically deploy to production.

## Environment-Specific Variables
- Production: Set your production database
- Preview: Use staging/test credentials
- Development: Use local development values

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `package.json` has correct scripts
- Check build logs for specific errors

### Database Connection Fails
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- Check both regular and `VITE_` prefixed versions
- Ensure database is accessible from Vercel IPs

### Images Don't Load
- Verify `R2_PUBLIC_URL` is correct
- Check CORS settings on R2 bucket
- Ensure images are uploaded successfully

##Performance
Vercel automatically provides:
- Global CDN
- Edge caching
- Automatic compression
- HTTP/2 support
- Zero-config HTTPS

## Monitoring
Access deployment logs and analytics:
- Vercel Dashboard → Your Project → Deployments
- View build logs, function logs, and analytics

---

**Ready to deploy!** 🚀
