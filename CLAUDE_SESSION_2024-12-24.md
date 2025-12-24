# Claude Code Session - Cognabase Local Development Setup

**Date:** December 24, 2024
**Project:** Cognabase Full Site Backup
**Location:** `/mnt/c/Users/flowc/Documents/Cognabase full site backup/`

---

## Session Overview

Successfully configured the Cognabase production site backup for local development by implementing a Clerk authentication bypass system.

## Problem Statement

The Cognabase site was cloned from the production VPS (`cognabase.com`) and needed to run locally for development/exploration. However, the site uses **Clerk Authentication** with production API keys that are domain-locked to `cognabase.com`, causing errors when accessed from `localhost:3000`.

**Error encountered:**
```
Clerk: Production Keys are only allowed for domain 'cognabase.com'
```

**User's constraint:** Upgrading to Clerk Pro ($25/month) was not viable just for local development, as the free tier doesn't allow multi-domain for production instances.

---

## Solution Implemented

Created a **conditional auth bypass system** that:
1. Detects when `BYPASS_AUTH=true` environment variable is set
2. Skips Clerk middleware and provider at runtime
3. Provides mock Clerk components that simulate a signed-in user
4. Allows full site exploration without valid Clerk credentials

---

## Files Modified

### 1. `.env.local`
Added bypass flags:
```env
# Local Development - Bypass Clerk Authentication
BYPASS_AUTH=true
NEXT_PUBLIC_BYPASS_AUTH=true
```

### 2. `proxy.ts` (Next.js Middleware)
Conditionally bypass clerkMiddleware:
```typescript
const bypassAuth = process.env.BYPASS_AUTH === 'true';

export default bypassAuth
  ? () => NextResponse.next()
  : clerkMiddleware();
```

### 3. `app/layout.tsx`
Conditionally skip ClerkProvider wrapper:
```typescript
const bypassAuth = process.env.BYPASS_AUTH === 'true';

// In RootLayout:
if (bypassAuth) {
  return content; // Skip ClerkProvider
}
return <ClerkProvider>{content}</ClerkProvider>;
```

### 4. `lib/clerk-bypass.tsx` (NEW)
Mock Clerk components for development:
- `MockSignedIn` - Always renders children
- `MockSignedOut` - Never renders (user is "signed in")
- `MockSignInButton` / `MockSignUpButton` - Links to /projects
- `MockUserButton` - Simple avatar component
- `useMockUser()` - Returns mock user object
- `useMockAuth()` - Returns mock auth state

Mock user:
```typescript
const mockUser = {
  id: 'dev-user-123',
  firstName: 'Dev',
  lastName: 'User',
  fullName: 'Dev User',
  emailAddresses: [{ emailAddress: 'dev@localhost.test' }],
};
```

### 5. `lib/auth.tsx` (NEW)
Centralized auth exports wrapper (for future use).

### 6. Page Updates with Conditional Imports

**Pattern applied to all pages:**
```typescript
const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

const mockUser = {
  id: 'dev-user-123',
  firstName: 'Dev',
  fullName: 'Dev User',
};

const useUser = bypassAuth
  ? () => ({ user: mockUser, isLoaded: true })
  : require('@clerk/nextjs').useUser;
```

**Pages updated:**
- `app/page.tsx` - Homepage (SignedIn, SignedOut, SignInButton, SignUpButton)
- `app/projects/page.tsx` - Projects dashboard (useUser, UserButton, SignedIn)
- `app/create/page.tsx` - Create project form (useUser)
- `app/project/[id]/page.tsx` - Project detail view (useUser)

---

## Technical Details

### Tech Stack
- **Framework:** Next.js 16.1 with Turbopack
- **React:** 19
- **Auth:** Clerk (production keys domain-locked)
- **Database:** Supabase (self-hosted at db.cognabase.com)
- **Styling:** Tailwind CSS 4

### Why `require()` Instead of Static Imports?
Using `require('@clerk/nextjs')` allows **runtime conditional loading**. Static imports would cause build errors even when Clerk components aren't used. The `require()` approach only loads Clerk modules when `bypassAuth` is `false`.

---

## Git Commits

| Commit | Message |
|--------|---------|
| `e89fae1` | Initial backup of cognabase.com from VPS |
| `fdc60b7` | Add Clerk auth bypass for local development |

---

## How to Use

### Start Development Server
```bash
cd "/mnt/c/Users/flowc/Documents/Cognabase full site backup"
npm run dev
```

### Access Site
- **URL:** http://localhost:3000
- **User:** Automatically signed in as "Dev User" (id: `dev-user-123`)

### Available Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, features, pricing |
| `/projects` | Projects dashboard (lists user's Supabase instances) |
| `/create` | Create new Supabase project form |
| `/project/[id]` | Project detail with credentials |

### Disable Bypass (Use Real Auth)
Set in `.env.local`:
```env
BYPASS_AUTH=false
NEXT_PUBLIC_BYPASS_AUTH=false
```

---

## Notes

- The mock user ID (`dev-user-123`) won't have any projects in Supabase, so the projects page will show "No projects yet"
- All Supabase operations still work (connecting to `db.cognabase.com`)
- To test with real data, you'd need to either:
  1. Create projects with the mock user ID in Supabase
  2. Use real Clerk auth with development keys

---

## Session Summary

| Metric | Value |
|--------|-------|
| Files Created | 2 |
| Files Modified | 6 |
| Total Changes | 8 files, +194/-13 lines |
| Server Status | Running at localhost:3000 |
| Git Status | Clean (all committed) |

**Task Status:** Complete
