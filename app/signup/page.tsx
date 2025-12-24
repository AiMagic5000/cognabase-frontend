'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Cognabase
        </Link>
      </div>

      {/* Sign Up */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Get Started</h1>
            <p className="text-gray-400">Create an account to deploy Supabase instances</p>
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-white/5 border border-white/10 shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
                formButtonPrimary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600',
                formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-500',
                formFieldLabel: 'text-white',
                footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                dividerLine: 'bg-white/10',
                dividerText: 'text-gray-400',
              },
              variables: {
                colorPrimary: '#10b981',
                colorText: '#ffffff',
                colorTextSecondary: '#d1d5db',
                colorBackground: '#000000',
                colorInputBackground: 'rgba(255,255,255,0.1)',
                colorInputText: '#ffffff',
              },
            }}
            signInUrl="/sign-in"
            redirectUrl="/projects"
          />
        </div>
      </div>
    </div>
  );
}
