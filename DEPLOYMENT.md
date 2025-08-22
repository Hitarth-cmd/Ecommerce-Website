# Vercel Deployment Guide

This guide will help you deploy your e-commerce website to Vercel.

## Prerequisites

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Make sure you have a Vercel account at [vercel.com](https://vercel.com)

## Deployment Steps

### 1. Prepare Your Environment Variables

Create a `.env` file in the root directory with your production environment variables:
```env
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret
```

### 2. Install Dependencies

Run the following command to install all dependencies:
```bash
npm run install-all
```

### 3. Build the Frontend

```bash
npm run build
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
vercel
```

Follow the prompts:
- Set up and deploy? → Yes
- Which scope? → Select your account
- Link to existing project? → No
- What's your project's name? → ecommerce-website
- In which directory is your code located? → ./
- Want to override the settings? → No

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the build settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm run install-all`

### 5. Configure Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add all your environment variables from the `.env` file

### 6. Update CORS Origins

After deployment, update the CORS origins in `server/index.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-actual-domain.vercel.app'] 
  : ['http://localhost:3000']
```

### 7. Redeploy

After making changes, redeploy:
```bash
vercel --prod
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Node.js backend
├── vercel.json      # Vercel configuration
├── package.json     # Root package.json
└── .vercelignore    # Files to ignore during deployment
```

## API Endpoints

Your API will be available at:
- Production: `https://your-domain.vercel.app/api/v1/*`
- Development: `http://localhost:8080/api/v1/*`

## Troubleshooting

1. **Build Errors**: Check the build logs in Vercel dashboard
2. **Environment Variables**: Ensure all required env vars are set in Vercel
3. **CORS Issues**: Update the origin URLs in your server configuration
4. **Database Connection**: Verify your Supabase credentials are correct

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints locally first
4. Check browser console for frontend errors
