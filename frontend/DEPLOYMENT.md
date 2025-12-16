# Afterlife Quiz - Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From the `frontend` directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy
   - Link to existing project or create new
   - Confirm settings

4. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your repository

5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Click "Deploy"

## Environment Variables

No environment variables required! The quiz works out of the box.

## Adaptive Calibration

The adaptive calibration system will automatically:
- Record user results
- Recalibrate every 100 users
- Adjust form weights to match target distributions

Calibration data is stored in `api/scoring-engine/data/calibration.json`

## Monitoring

After deployment, you can:

1. View calibration status by accessing:
   ```
   https://your-app.vercel.app/api/calibration-status
   ```

2. Check analytics in Vercel dashboard

3. Monitor function logs for any errors

## Custom Domain

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Local Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Troubleshooting

### API not working

Check that:
- `api/scoring-engine` directory exists
- `quiz_data_questions.json` is in `public/data/`
- Vercel build logs for errors

### Build fails

Run locally first:
```bash
npm run build
```

Fix any errors before deploying.

### Forms not distributed correctly

This is normal initially! The adaptive calibration needs real user data.
After 500-1000 users, distributions will converge to targets.

## Support

For issues, check:
- Vercel function logs
- Browser console
- Network tab (for API errors)
