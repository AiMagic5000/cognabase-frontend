# Cognabase Frontend - AI Coding Agent Instructions

## Project Overview
Cognabase is a Next.js 16 frontend for managing self-hosted Supabase instances on demand. It provides a complete authentication system with modern dark-theme UI for creating, monitoring, and deleting Supabase projects that are provisioned via n8n workflows.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + PostCSS
- Supabase Auth + Client SDK
- Lucide React (icons)
- ESLint + TypeScript strict mode

## Architecture & Data Flow

### Three-Tier Application Flow
1. **Frontend UI** → User submits project creation/deletion form (authenticated)
2. **API Route** → Validates UUID and forwards to n8n webhook with auth header
3. **External Service (n8n)** → Orchestrates infrastructure provisioning/cleanup

### Authentication Flow
- Supabase Auth handles signup/login with email + password
- Session tokens stored in cookies (`sb-access-token`)
- Middleware (`middleware.ts`) protects routes - redirects unauthenticated users to login
- Public routes: `/`, `/login`, `/signup`
- Protected routes: `/projects`, `/project/[id]`, `/create`

### Database Schema
- **projects table**: `id`, `user_id`, `project_name`, `status` ('creating'|'ready'|'failed'), `step` (creation stage), `studio_url`, credentials (admin_username, admin_password, postgres_password, jwt_secret, anon_key, service_key)
- All data filtered by `user_id` on the frontend - only logged-in user's projects visible
- All project data flows through Supabase client initialized in [lib/supabase.ts](lib/supabase.ts)

### Polling Pattern
- [app/project/[id]/page.tsx](app/project/[id]/page.tsx) polls every 3 seconds during 'creating' state
- Stops polling automatically when `status === 'ready'` or on error
- Displays step-by-step progress messages defined in `STEP_MESSAGES` object

## UI/UX Design System

### Theme & Aesthetics
- **Dark Mode**: Black background (`bg-black`) with white text
- **Gradient Accent**: Emerald → Cyan (`from-emerald-500 to-cyan-500`)
- **Modern Design**: Rounded borders, subtle shadows, hover states
- **Icons**: Lucide React icons (Check, Copy, Trash2, Loader2, etc.)

### Component Patterns
- **Status Badges**: `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` (ready), `bg-yellow-500/10` (creating), `bg-red-500/10` (failed)
- **Input Fields**: `bg-white/10 border border-white/20 rounded-lg focus:border-emerald-500`
- **Buttons**: Gradient for primary actions, bordered for secondary
- **Cards**: `bg-white/5 border border-white/10 rounded-xl` with hover effects
- **Loading Spinners**: Animated with `animate-spin` using Lucide icons

### Color Palette
- Background: `#000000` (black)
- Borders: `white/10` or `white/20`
- Hover states: `white/5` → `white/10`
- Success (Emerald): `#10b981`
- Warning (Yellow): `#eab308`
- Danger (Red): `#ef4444`
- Cyan accent: `#06b6d4`

## Project-Specific Patterns

### Client-Side Components
- Use `'use client'` for all interactive pages: `/create`, `/projects`, `/project/[id]`, `/login`, `/signup`
- Only [app/layout.tsx](app/layout.tsx) and [app/page.tsx](app/page.tsx) are server components
- Authentication state checked with `supabase.auth.getUser()` on component mount

### Form Validation Pattern
```typescript
const validateProjectName = (name: string): boolean => {
  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(name) && name.length >= 3 && name.length <= 30;
};
```
- Always validate **before** DB insert to prevent invalid state
- Provide real-time validation feedback during typing

### API Route Patterns
- [app/api/create-project/route.ts](app/api/create-project/route.ts) - POST endpoint, validates UUID, calls n8n webhook with `X-Auth-Secret` header
- [app/api/delete-project/route.ts](app/api/delete-project/route.ts) - POST endpoint, validates UUID, calls n8n delete webhook
- All env vars required: `N8N_WEBHOOK_URL`, `N8N_AUTH_SECRET`

### Copy-to-Clipboard Pattern
- Implemented in [app/project/[id]/page.tsx](app/project/[id]/page.tsx)
- Button shows `Check` icon briefly (2 seconds) after copying
- Used for credentials display for easy sharing

### Delete Functionality
- Confirmation modal prevents accidental deletion
- Shows loading state during deletion
- Calls `/api/delete-project` → n8n webhook → n8n triggers cleanup
- Redirects to `/projects` after successful deletion

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| [middleware.ts](middleware.ts) | Route protection, redirects to login for unauthenticated users |
| [lib/supabase.ts](lib/supabase.ts) | Supabase client + `Project` type definition |
| [app/page.tsx](app/page.tsx) | Landing page (public) with feature highlights |
| [app/login/page.tsx](app/login/page.tsx) | Email/password login form |
| [app/signup/page.tsx](app/signup/page.tsx) | Email/password signup form |
| [app/create/page.tsx](app/create/page.tsx) | Project creation form + n8n trigger |
| [app/projects/page.tsx](app/projects/page.tsx) | User's projects list + status badges + logout |
| [app/project/[id]/page.tsx](app/project/[id]/page.tsx) | Real-time polling + credentials display + delete button |
| [app/api/create-project/route.ts](app/api/create-project/route.ts) | POST endpoint for creation webhook |
| [app/api/delete-project/route.ts](app/api/delete-project/route.ts) | POST endpoint for deletion webhook |
| [app/globals.css](app/globals.css) | Dark theme + Tailwind config |

## Development Commands
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm start         # Run production server
npm run lint      # Run ESLint checks
```

## Critical Conventions

1. **User Filtering**: Always filter projects by `user_id === auth.user.id` - never show all projects
2. **Error Handling**: Console.error + return human-readable message to user + display in error alert
3. **Loading States**: Use Lucide `Loader2` icon with `animate-spin` + disabled buttons during async operations
4. **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` for frontend; `N8N_WEBHOOK_URL`, `N8N_AUTH_SECRET` for backend only
5. **TypeScript**: Strict mode enabled; define `Project` type explicitly for all project data
6. **Status Flow**: One-way transition: `creating` → `ready` OR `failed` (never reverses)
7. **Credentials Display**: Copy-to-clipboard on click, show `Check` icon feedback for 2 seconds
8. **Dark Theme**: Use black background, white/10 borders, emerald/cyan gradients for all new UI

## Common Tasks & How-Tos

**Add new project field:**
1. Update `Project` type in [lib/supabase.ts](lib/supabase.ts)
2. Add credential display section in [app/project/[id]/page.tsx](app/project/[id]/page.tsx) with copy button
3. Ensure n8n populates the field (backend responsibility)

**Add validation rule:**
Update `validateProjectName` in [app/create/page.tsx](app/create/page.tsx), add real-time feedback like "✓ Valid project name"

**Modify polling interval:**
Change `3000` (ms) in [app/project/[id]/page.tsx](app/project/[id]/page.tsx#L36) interval (currently set to 3 seconds)

**Style new components:**
Use the modern dark theme pattern: `bg-white/5 border border-white/10 rounded-xl` for cards, `from-emerald-500 to-cyan-500` for gradients
