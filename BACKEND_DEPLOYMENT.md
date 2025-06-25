# Backend Deployment Guide

This guide will help you deploy the SafeDoser backend to a separate repository and hosting platform.

## 🚀 Step 1: Create Separate Backend Repository

### Option A: Create New Repository on GitHub

1. **Create new repository:**
   - Go to GitHub and create a new repository named `safedoser-backend`
   - Don't initialize with README (we'll push existing code)

2. **Copy backend files:**
   ```bash
   # Create a new directory for the backend
   mkdir safedoser-backend
   cd safedoser-backend
   
   # Copy all backend files from your current project
   cp -r /path/to/your/current/project/backend/* .
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial backend setup"
   
   # Add remote and push
   git remote add origin https://github.com/yourusername/safedoser-backend.git
   git branch -M main
   git push -u origin main
   ```

### Option B: Split Existing Repository

If you want to keep git history:

```bash
# Clone your current repository
git clone https://github.com/yourusername/safedoser-app.git safedoser-backend
cd safedoser-backend

# Remove everything except backend
find . -maxdepth 1 ! -name 'backend' ! -name '.git' ! -name '.' -exec rm -rf {} +
mv backend/* .
rmdir backend

# Update git remote
git remote set-url origin https://github.com/yourusername/safedoser-backend.git
git add .
git commit -m "Split backend into separate repository"
git push -u origin main
```

## 🌐 Step 2: Deploy Backend

### Option A: Railway (Recommended - Easy & Free)

1. **Sign up at Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `safedoser-backend` repository
   - Railway will auto-detect it's a Python app

3. **Set Environment Variables:**
   - Go to your project dashboard
   - Click "Variables" tab
   - Add these variables:
     ```
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your-anon-key-here
     GEMINI_API_KEY=your-gemini-api-key-here
     JWT_SECRET_KEY=your-super-secret-jwt-key
     ```

4. **Get your deployment URL:**
   - Railway will provide a URL like: `https://safedoser-backend-production.up.railway.app`

### Option B: Render (Alternative)

1. **Sign up at Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT --timeout 120 app:app`

3. **Set Environment Variables:**
   - In the Render dashboard, go to Environment
   - Add the same variables as above

### Option C: Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd safedoser-backend
   vercel
   ```

3. **Set Environment Variables:**
   - Use Vercel dashboard or CLI:
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add GEMINI_API_KEY
   vercel env add JWT_SECRET_KEY
   ```

## 🔧 Step 3: Update Frontend Configuration

Once your backend is deployed, update your frontend to use the new backend URL:

### Update API Base URL

1. **Create environment variable:**
   ```bash
   # In your frontend project root, create/update .env
   echo "VITE_API_BASE_URL=https://your-backend-url.com" >> .env
   ```

2. **Update AuthContext.tsx:**
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
   ```

3. **Update useChat.ts:**
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
   ```

### Test the Connection

1. **Start your frontend:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Try signing up with a new account
   - Try logging in
   - Check browser network tab for API calls

3. **Test chat functionality:**
   - Go to the chatbot page
   - Send a message
   - Verify AI responses

## 🔍 Step 4: Verify Deployment

### Check Backend Health

Visit your backend URL + `/health`:
```
https://your-backend-url.com/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "gemini_configured": true,
  "supabase_configured": true
}
```

### Test API Endpoints

1. **Test signup:**
   ```bash
   curl -X POST https://your-backend-url.com/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User","age":25}'
   ```

2. **Test login:**
   ```bash
   curl -X POST https://your-backend-url.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Make sure your frontend URL is in the CORS origins in `app.py`
   - Update the CORS configuration if needed

2. **Environment Variables:**
   - Double-check all environment variables are set correctly
   - Verify Supabase URL and keys are correct

3. **Database Connection:**
   - Ensure Supabase database schema is created
   - Check RLS policies are enabled

4. **Gemini AI:**
   - Verify API key is correct
   - Check API quotas and billing
   - Backend will work with fallback responses if Gemini fails

### Logs and Debugging

**Railway:**
- Go to your project dashboard
- Click "Deployments" tab
- Click on latest deployment to see logs

**Render:**
- Go to your service dashboard
- Click "Logs" tab

**Vercel:**
- Go to your project dashboard
- Click "Functions" tab
- View function logs

## 🎉 Step 5: Update Frontend Environment

Once everything is working, update your frontend's environment variables for production:

```bash
# .env.production
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📞 Next Steps

1. **Monitor your deployment** - Set up monitoring and alerts
2. **Set up CI/CD** - Automatic deployments on git push
3. **Add custom domain** - Use your own domain name
4. **Scale as needed** - Upgrade hosting plan when you get more users

Your backend is now deployed and ready to serve your SafeDoser frontend! 🎉

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)