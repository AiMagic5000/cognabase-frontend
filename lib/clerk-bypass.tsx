'use client';

import { ReactNode } from 'react';

/**
 * Mock Clerk components for local development when BYPASS_AUTH=true
 * These allow exploring the site without a valid Clerk connection
 */

// Mock user for development
export const mockUser = {
  id: 'dev-user-123',
  firstName: 'Dev',
  lastName: 'User',
  fullName: 'Dev User',
  emailAddresses: [{ emailAddress: 'dev@localhost.test' }],
  primaryEmailAddress: { emailAddress: 'dev@localhost.test' },
};

// SignedIn - always render children in bypass mode
export function MockSignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// SignedOut - never render children in bypass mode (user is "signed in")
export function MockSignedOut({ children }: { children: ReactNode }) {
  return null;
}

// SignInButton - render button that links to /projects
export function MockSignInButton({ children, mode }: { children: ReactNode; mode?: string }) {
  return <a href="/projects">{children}</a>;
}

// SignUpButton - render button that links to /projects
export function MockSignUpButton({ children, mode }: { children: ReactNode; mode?: string }) {
  return <a href="/projects">{children}</a>;
}

// UserButton - render a simple avatar
export function MockUserButton() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
      D
    </div>
  );
}

// useUser hook mock
export function useMockUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  };
}

// useAuth hook mock
export function useMockAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: mockUser.id,
    sessionId: 'dev-session-123',
    getToken: async () => 'dev-token-mock',
  };
}
