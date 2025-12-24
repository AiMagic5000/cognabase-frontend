'use client';

/**
 * Auth wrapper - exports either real Clerk components or mocks based on BYPASS_AUTH
 *
 * Usage: import { SignedIn, SignedOut, useUser } from '@/lib/auth'
 */

const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

// Re-export based on bypass mode
export {
  MockSignedIn as SignedIn,
  MockSignedOut as SignedOut,
  MockSignInButton as SignInButton,
  MockSignUpButton as SignUpButton,
  MockUserButton as UserButton,
  useMockUser as useUser,
  useMockAuth as useAuth,
  mockUser,
} from './clerk-bypass';

// For components that need the original when not bypassing
export const isAuthBypassed = bypassAuth;
