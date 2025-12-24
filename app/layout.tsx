import type { Metadata } from 'next';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cognabase - Self-Hosted Supabase On Demand',
  description: 'Deploy fully managed Supabase instances in minutes. Complete control, security, and privacy.',
  keywords: 'Supabase, Self-hosted, PostgreSQL, Backend-as-a-Service',
  openGraph: {
    title: 'Cognabase - Self-Hosted Supabase On Demand',
    description: 'Deploy fully managed Supabase instances in minutes',
    url: 'https://cognabase.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/projects" 
      signUpFallbackRedirectUrl="/projects"
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
