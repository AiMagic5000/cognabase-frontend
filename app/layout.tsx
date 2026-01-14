import type { Metadata } from 'next';
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

// Check if auth bypass is enabled for local development
const bypassAuth = process.env.BYPASS_AUTH === 'true';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );

  // Skip ClerkProvider when bypassing auth
  if (bypassAuth) {
    return content;
  }

  // Dynamically import ClerkProvider only when needed
  const { ClerkProvider } = await import('@clerk/nextjs');

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/projects"
      signUpFallbackRedirectUrl="/projects"
    >
      {content}
    </ClerkProvider>
  );
}
