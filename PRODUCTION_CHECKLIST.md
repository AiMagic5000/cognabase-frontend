# Production Environment Checklist

Complete this checklist before deploying to Coolify.

## ✅ Environment Variables

### Development (`.env.local` - for localhost testing)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = your dev Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your dev anon key
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = pk_test_* (dev key)
- [ ] `CLERK_SECRET_KEY` = sk_test_* (dev secret)
- [ ] `N8N_WEBHOOK_URL` = your n8n webhook URL
- [ ] `N8N_AUTH_SECRET` = your webhook secret

**Test locally**: `npm run dev` → http://localhost:3000 → Sign up → Create project

### Production (`.env.production.local` - for Coolify)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = your production Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your production anon key
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = pk_live_* (production key)
- [ ] `CLERK_SECRET_KEY` = sk_live_* (production secret)
- [ ] `N8N_WEBHOOK_URL` = your n8n webhook URL
- [ ] `N8N_AUTH_SECRET` = strong 32+ character secret

**DO NOT commit** `.env.production.local` to git!

---

## ✅ Clerk Configuration

- [ ] Created Production instance in Clerk Dashboard
- [ ] Added domain: `cognabase.com`
- [ ] Verified all 5 DNS CNAME records in Clerk → Domains
- [ ] Configured redirect paths:
  - `/sign-in` → `/sign-in`
  - `/sign-up` → `/sign-up`
  - After sign-in → `/projects`
  - After sign-up → `/projects`
- [ ] Added `https://cognabase.com` to Authorized Redirect Origins
- [ ] Copied production keys: `pk_live_*` and `sk_live_*`

---

## ✅ Domain & DNS

- [ ] Domain registered: `cognabase.com`
- [ ] All 5 Clerk DNS records verified in Clerk dashboard:
  - `clerk.cognabase.com` → `frontend-api.clerk.services`
  - `accounts.cognabase.com` → `accounts.clerk.services`
  - `clkmail.cognabase.com` → `mail.ull0pxgorjbj.clerk.services`
  - `clk._domainkey.cognabase.com` → `dkim1.ull0pxgorjbj.clerk.services`
  - `clk2._domainkey.cognabase.com` → `dkim2.ull0pxgorjbj.clerk.services`
- [ ] SSL certificates issued by Clerk (automatic after DNS verification)

---

## ✅ Coolify Setup

- [ ] Coolify server running and accessible
- [ ] GitHub repository connected to Coolify
- [ ] Application created: `cognabase` 
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Port: `3000`
- [ ] Domain configured: `cognabase.com`
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] All 6 environment variables added (no extra spaces)

---

## ✅ Code Quality

- [ ] No hardcoded URLs in code (all in env vars)
- [ ] Middleware (`proxy.ts`) is correct
- [ ] ClerkProvider in `layout.tsx` has explicit config
- [ ] API routes have proper validation
- [ ] No test keys in code comments
- [ ] `.env.production.local` is in `.gitignore`

---

## ✅ Pre-Deployment Testing

- [ ] Local build succeeds: `npm run build`
- [ ] Local production server starts: `npm start`
- [ ] Sign up flow works at http://localhost:3000
- [ ] Create project flow works (gets to loading page)
- [ ] No console errors in browser DevTools
- [ ] Responsive on mobile/tablet

---

## ✅ Deploy to Coolify

1. [ ] Make sure `.env.production.local` is filled with production values
2. [ ] Push code to `main` branch (`.env.production.local` should be gitignored)
3. [ ] Go to Coolify dashboard
4. [ ] Click **Deploy** on the cognabase application
5. [ ] Wait for build to complete (3-5 min)
6. [ ] Check logs for any errors
7. [ ] Visit https://cognabase.com

---

## ✅ Post-Deployment Verification

- [ ] https://cognabase.com loads without errors
- [ ] Sign up button works
- [ ] Can create account with test email
- [ ] Redirects to `/projects` after sign up
- [ ] Projects list shows (empty is normal)
- [ ] Can navigate to "New Project"
- [ ] Can create a new project
- [ ] Loading page shows (creating project)
- [ ] Check Coolify logs: `docker logs coolify-cognabase` (no errors)
- [ ] Monitor N8N: check webhook executions for "create project"

---

## ✅ Monitoring & Maintenance

- [ ] Set up email alerts in Coolify (optional)
- [ ] Monitor application logs daily first week
- [ ] Check n8n workflow logs for failed deployments
- [ ] Plan security updates for Next.js/dependencies
- [ ] Backup Supabase database regularly
- [ ] Monitor Coolify resource usage

---

## 📋 Quick Rollback

If something breaks in production:

1. Go to Coolify → Application → Deployments
2. Click on previous stable deployment
3. Click **Redeploy**
4. Wait for build
5. Check logs

---

## 🎉 Ready for Launch!

Once everything above is checked:

1. Announce: https://cognabase.com is live! 🚀
2. Test thoroughly with actual users
3. Monitor for any issues
4. Keep n8n and Supabase healthy
5. Plan next features/improvements

**Congrats! You've launched Cognabase!** 🎊
