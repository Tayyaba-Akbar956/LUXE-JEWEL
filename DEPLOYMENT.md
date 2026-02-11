# Deployment Script for LuxeJewel

This project is configured for deployment on Vercel. Follow these steps to deploy:

## Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

## Deployment Steps

### 1. Link Your Project
```bash
cd luxejewel
vercel
```

Follow the prompts to link your project to a Vercel account and project.

### 2. Set Environment Variables

During the deployment setup, you'll need to provide the following environment variables:

#### Production Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT` - Set to `true` to use mock payment system
- `NEXT_PUBLIC_APP_URL` - Your deployed application URL (e.g., https://luxejewel.vercel.app)

#### Build Environment Variables:
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side operations
- `GOOGLE_API_KEY` - Google API key for AI features

### 3. Deploy
After setting up the environment variables, deploy your project:
```bash
vercel --prod
```

## Alternative: Git Integration

For continuous deployment:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Vercel will automatically deploy when you push to your main branch

## Post-Deployment Setup

After deployment, you may need to:

1. Configure your domain (if using a custom domain)
2. Set up email templates in Supabase for authentication emails
3. Configure Stripe webhooks (if using real payments)
4. Set up Google AI services for visual search

## Rollback

To rollback to a previous deployment:
```bash
vercel deployments
vercel alias set <deployment-url> production
```

## Monitoring

Monitor your deployment through the Vercel dashboard:
- View logs and error reports
- Monitor performance metrics
- Track visitor analytics