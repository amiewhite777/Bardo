# Vercel 404 Troubleshooting Guide

## Quick Fixes

### Fix 1: Check Vercel Project Settings

1. Go to your Vercel project → **Settings**
2. Under **General**, verify:
   - **Root Directory**: Should be `frontend` (or empty if deploying from frontend folder)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Redeploy** after changing settings

### Fix 2: If Main Page Shows 404

This means Vercel isn't finding your built files.

**Solution:**
- In Vercel dashboard → **Settings** → **General**
- Set **Root Directory** to: `frontend`
- **Save** and **Redeploy**

OR if deploying from the frontend folder itself:
- Leave **Root Directory** empty
- Make sure you're deploying the `frontend` directory, not the root

### Fix 3: If API Returns 404

The API route might not be deploying correctly.

**Check in Vercel:**
1. Go to **Functions** tab
2. Look for `api/score.js`
3. If it's missing, the API didn't deploy

**Solution:**
Vercel needs the api folder at the root. Try this structure:

```
frontend/
├── api/
│   ├── score.js
│   └── ...
├── src/
├── public/
└── ...
```

### Fix 4: Test Locally First

```bash
cd frontend
npm install
npm run build
npx serve dist
```

Visit `http://localhost:3000` - does it work?

If yes → Vercel configuration issue
If no → Build issue

### Fix 5: Check Vercel Build Logs

1. Go to your deployment in Vercel
2. Click on the deployment
3. Go to **Building** tab
4. Look for errors

Common errors:
- `Module not found` → Missing dependencies
- `Build failed` → Check package.json scripts
- `404` → Wrong output directory

### Fix 6: Simplify vercel.json

Try this minimal config:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"  
}
```

### Fix 7: Environment Check

Make sure in Vercel settings:
- **Node.js Version**: 18.x or higher
- No conflicting environment variables

## What URL are you seeing 404 on?

1. **Main page** (`https://your-app.vercel.app/`)
   → This is a build/deployment config issue
   
2. **API route** (`https://your-app.vercel.app/api/score`)
   → API isn't deploying correctly

3. **After taking quiz**
   → API route issue or CORS

## Quick Test

Can you share:
1. The exact URL showing 404?
2. Your Vercel project settings (Root Directory, Build Command)?
3. Any error in browser console (F12)?

This will help me give you the exact fix!
