import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { ArrowRight, Zap, Shield, Gauge, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Cognabase
          </div>
          <div className="space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-6 py-2 text-white/80 hover:text-white transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/projects"
                className="px-6 py-2 text-white/80 hover:text-white transition"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-sm text-emerald-400 font-medium">🚀 Self-hosted made simple</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Deploy Supabase
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              On Demand
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Provision fully managed Supabase instances in minutes. No infrastructure knowledge required. Complete control, security, and privacy.
          </p>
          
          <div className="flex gap-4 justify-center mb-16 flex-wrap">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition flex items-center gap-2">
                  Start Building <ArrowRight size={20} />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/projects"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            </SignedIn>
          </div>

          {/* Demo Badge */}
          <div className="inline-block bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400">
            Ready in <span className="text-emerald-400 font-semibold">2-4 minutes</span> per instance
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition group">
            <Zap className="text-emerald-400 mb-4 group-hover:scale-110 transition" size={32} />
            <h3 className="text-xl font-semibold mb-2">Deploy Instantly</h3>
            <p className="text-gray-400">Create a fully functional Supabase instance in minutes, not hours. Watch real-time progress updates.</p>
          </div>
          
          <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition group">
            <Shield className="text-cyan-400 mb-4 group-hover:scale-110 transition" size={32} />
            <h3 className="text-xl font-semibold mb-2">Self-Hosted Security</h3>
            <p className="text-gray-400">Keep your data in your infrastructure. Complete control, zero vendor lock-in, total privacy.</p>
          </div>
          
          <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition group">
            <Gauge className="text-blue-400 mb-4 group-hover:scale-110 transition" size={32} />
            <h3 className="text-xl font-semibold mb-2">Monitor & Manage</h3>
            <p className="text-gray-400">Real-time status tracking, one-click credential access, and easy project management.</p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-400">Create your account in seconds with email and password</p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
          </div>
          
          <div className="relative">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">2</div>
              <h3 className="text-xl font-semibold mb-2">Create Project</h3>
              <p className="text-gray-400">Name your project and watch as we provision your instance</p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
          </div>
          
          <div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">3</div>
              <h3 className="text-xl font-semibold mb-2">Access Credentials</h3>
              <p className="text-gray-400">Get instant access to studio, API keys, and database credentials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Built with Modern Tech</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Next.js 16', 'React 19', 'Supabase', 'Tailwind CSS'].map((tech, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:border-emerald-500/50 transition">
              <p className="text-white font-semibold">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Deploy?</h2>
        <p className="text-xl text-gray-300 mb-8">Join developers building the next generation of applications with self-hosted Supabase.</p>
        <Link 
          href="/sign-up"
          className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition"
        >
          Create Your First Instance
        </Link>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">Cognabase</div>
              <p className="text-gray-400">Self-hosted Supabase made simple</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <Link href="/sign-up" className="hover:text-white transition">Get Started</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <Link href="/sign-in" className="hover:text-white transition">Sign In</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4 text-gray-400">
                <a href="#" className="hover:text-white transition"><Github size={20} /></a>
                <a href="#" className="hover:text-white transition"><Mail size={20} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Cognabase. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
