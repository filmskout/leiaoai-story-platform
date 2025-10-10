# LeiaoAI Platform - Vercel Deployment Guide

## Quick Deployment Steps

### Step 1: Prepare Repository

1. **Create or use existing GitHub repository**:
   ```bash
   # If creating new repository
   git init
   git add .
   git commit -m "Initial commit: LeiaoAI Platform Restored"
   git branch -M main
   git remote add origin https://github.com/filmskout/leiaoai-story-platform.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "New Project"**
3. **Import from GitHub**: Select `filmskout/leiaoai-story-platform`
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### Step 3: Configure Environment Variables

In Vercel Project Settings > Environment Variables, add:

```env
# Required - Supabase Configuration
VITE_SUPABASE_URL=https://fwjerftzoosqmijmnkyb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amVyZnR6b29zcW1pam1ua3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMTI4NjgsImV4cCI6MjA3NDU4ODg2OH0.uqeFb9VgSN4LMqjH40IFDihaEbIMIV6OkrZ3A1lDmu8

# AI Model APIs (Add the ones you have access to)
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_DEEPSEEK_API_KEY=your-deepseek-key
VITE_QWEN_API_KEY=your-qwen-key

# Optional
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Your site will be live** at: `https://your-project-name.vercel.app`

## Verification Checklist

After deployment, verify:

- [ ] Site loads correctly
- [ ] All 13 languages work (test language switcher)
- [ ] AI Chat functionality works with available models
- [ ] Professional services carousel works
- [ ] Dark/light theme switching works
- [ ] Mobile responsiveness works
- [ ] Logo displays correctly in both themes

## Troubleshooting

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - Missing environment variables
   - Node.js version mismatch
   - TypeScript errors

### Environment Variables Not Working

1. **Ensure variables start with `VITE_`**
2. **Redeploy** after adding environment variables
3. **Check spelling** of variable names

### AI Chat Not Working

1. **Verify API keys** are correctly set
2. **Check browser console** for API errors
3. **Test with different models**

## Advanced Configuration

### Custom Domain

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS settings as shown

### Performance Optimization

The deployment includes:
- Static asset caching
- Code splitting
- Image optimization
- Gzip compression

### Monitoring

- **Vercel Analytics**: Automatically enabled
- **Error tracking**: Built-in error boundaries
- **Performance**: Web Vitals tracking

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first: `pnpm dev`
4. Check browser console for errors

---

**Expected Result**: Fully functional LeiaoAI platform with all 13 languages, AI chat (3 models), and professional services integration.
