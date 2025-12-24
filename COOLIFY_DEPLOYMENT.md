# Coolify Deployment Guide - Cognabase Frontend

This guide walks you through deploying Cognabase frontend to Coolify with production Clerk authentication.

---

## 📋 **Prerequisites**

Before starting, make sure you have:

- ✅ Coolify server running (with Docker)
- ✅ Git repository with your code (GitHub)
- ✅ Production Clerk keys (`pk_live_*`, `sk_live_*`)
- ✅ DNS configured for `cognabase.com`
- ✅ All Clerk DNS records verified (CNAME records)

---

## 🚀 **Step 1: Prepare Environment Variables**

Fill in `.env.production.local` with your **production credentials**:

```bash
# .env.production.local
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_SECRET_HERE
N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/cognabase
N8N_AUTH_SECRET=your-strong-32-character-secret
```

⚠️ **DO NOT commit this file to git.**

---

## 🔗 **Step 2: Connect Coolify to Your Repository**

### In Coolify Dashboard:

1. Click **Create Project**
2. Name it: `cognabase`
3. Click **Create**
4. Click **Add Application**
5. Select **GitHub** (or your Git provider)
6. Choose your `cognabase-frontend` repository
7. Select branch: `main`
8. Click **Add Application**

---

## ⚙️ **Step 3: Configure Build Settings**

In the application settings:

### Build Configuration:
```
Build Command:  npm run build
Start Command:  npm start
Port:          3000
```

### Health Check:
```
URL:           /
Expected Code: 200
Interval:      30 seconds
```

---

## 🔐 **Step 4: Add Environment Variables**

In Coolify UI, go to **Application → Environment Variables**

Add each variable from `.env.production.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | pk_live_... |
| `CLERK_SECRET_KEY` | sk_live_... |
| `N8N_WEBHOOK_URL` | Your n8n webhook |
| `N8N_AUTH_SECRET` | Your webhook secret |

**⚠️ CRITICAL**: Double-check there are **NO extra spaces** before or after values.

---

## 🌐 **Step 5: Configure Domain**

In **Application → Settings → General**:

### Domain Configuration:
- **Domain Type**: Choose based on your setup
- **Domain**: `cognabase.com`
- **HTTPS**: Enable (Coolify auto-provisions Let's Encrypt)

---

## 🔧 **Step 6: Deploy**

1. Click **Deploy** button
2. Watch the logs for build progress
3. Wait for "Deployment Successful" message
4. Build typically takes **2-5 minutes**

### Monitor Deployment:
```bash
# In Coolify UI, click "Logs"
# You'll see:
# - npm install (20-30s)
# - npm run build (1-2 min)
# - Starting server (5-10s)
```

---

## ✅ **Step 7: Verify Deployment**

1. Visit: `https://cognabase.com`
2. **Test Sign Up**:
   - Click "Sign Up"
   - Enter email and password
   - Should redirect to `/projects`
3. **Test Create Project**:
   - Click "New Project"
   - Enter project name: `test-project`
   - Click "Create Project"
   - Should show deployment progress
4. **Check Logs**:
   - Coolify UI → Logs → check for errors
   - Should see "Created project..." message

---

## 🚨 **Troubleshooting**

### Build Fails with "Cannot find module"
**Cause**: Dependencies not installed
**Fix**: 
- Delete `.next` folder
- Run deployment again
- Coolify will reinstall dependencies

### "Invalid Clerk Key" Error
**Cause**: Wrong key format or using test keys in production
**Fix**:
- Verify keys start with `pk_live_` and `sk_live_`
- Not `pk_test_` or `sk_test_`
- Redeploy after updating

### "Unauthorized redirect origin"
**Cause**: Domain not configured in Clerk
**Fix**:
1. Go to Clerk Dashboard → Settings → Domains
2. Verify `cognabase.com` is listed
3. Check Authorized Redirect Origins include `https://cognabase.com`
4. Redeploy

### "Connection Refused" on N8N Webhook
**Cause**: Invalid webhook URL or secret mismatch
**Fix**:
1. Verify `N8N_WEBHOOK_URL` is correct
2. Verify `N8N_AUTH_SECRET` matches n8n configuration
3. Check n8n instance is running
4. Test webhook manually from n8n dashboard

### App Runs Locally But Fails in Coolify
**Cause**: Environment variables not set correctly
**Fix**:
1. Go to Coolify → Application → Environment Variables
2. Verify **no spaces** in any value
3. Check variable names match exactly
4. Redeploy with latest changes

---

## 📊 **Monitor Production**

### In Coolify UI:

**Application → Overview:**
- Status: should show "Running ✓"
- Memory/CPU usage
- Recent deployments

**Application → Logs:**
- Real-time application logs
- Check for errors after deployment
- Monitor for crashes

**Application → Health:**
- Health check status
- Response times
- Downtime alerts

---

## 🔄 **Update Deployment**

To update the app after making code changes:

1. Push changes to `main` branch
2. Coolify auto-detects changes (if webhook enabled)
3. Or manually click **Deploy** in Coolify UI
4. Wait for build to complete

---

## 🛡️ **Security Checklist**

- [ ] Using `pk_live_` and `sk_live_` keys (not test keys)
- [ ] `N8N_AUTH_SECRET` is strong (32+ chars)
- [ ] Environment variables are not in git history
- [ ] HTTPS is enabled on domain
- [ ] Coolify firewall allows only HTTPS
- [ ] Database backups are configured
- [ ] Regular deployments for security patches

---

## 💬 **Common Questions**

**Q: Will Coolify auto-redeploy when I push to main?**
A: Only if GitHub webhook is configured in Coolify. Otherwise, manually click Deploy.

**Q: How long does deployment take?**
A: First deploy: ~3-5 min. Subsequent: ~2-3 min (cached dependencies).

**Q: Can I customize Node.js version?**
A: Yes, in Dockerfile or Coolify Advanced Settings. Default is latest LTS.

**Q: What if I need to scale to multiple instances?**
A: Coolify supports load balancing. See Coolify docs for horizontal scaling.

---

## 📞 **Support Resources**

- **Coolify Docs**: https://coolify.io/docs
- **Clerk Docs**: https://clerk.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Check the repo for similar issues
