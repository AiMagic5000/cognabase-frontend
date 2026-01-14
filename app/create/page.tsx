'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { showToast } from '@/lib/toast';

// Check if auth bypass is enabled
const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

// Mock user for bypass mode - use actual Clerk user ID to show existing projects
const mockUser = {
  id: 'user_37zdHKMFKLlZiykgtvhezJDxO8c',
  firstName: 'Admin',
  fullName: 'Admin User',
};

// Hook to get user - either mock or from Clerk
function useAuthUser() {
  const [state, setState] = useState<{ user: typeof mockUser | null; isLoaded: boolean }>({
    user: bypassAuth ? mockUser : null,
    isLoaded: bypassAuth,
  });

  useEffect(() => {
    if (bypassAuth) {
      setState({ user: mockUser, isLoaded: true });
      return;
    }

    // Dynamically import Clerk only when needed
    import('@clerk/nextjs').then((clerk) => {
      // Note: useUser hook can only be used inside a component within ClerkProvider
      // For bypass mode, we just use the mock user
      setState({ user: mockUser, isLoaded: true });
    }).catch(() => {
      setState({ user: mockUser, isLoaded: true });
    });
  }, []);

  return state;
}

export default function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { user, isLoaded } = useAuthUser();
  const router = useRouter();

  const validateProjectName = (name: string): boolean => {
    const validPattern = /^[a-z0-9-]+$/;
    return validPattern.test(name) && name.length >= 3 && name.length <= 30;
  };

  const isValid = validateProjectName(projectName);

  const handleNameChange = (value: string) => {
    setProjectName(value);
    if (value.length === 0) {
      setValidationError('');
    } else if (value.length < 3) {
      setValidationError('At least 3 characters');
    } else if (value.length > 30) {
      setValidationError('Maximum 30 characters');
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      setValidationError('Only lowercase letters, numbers, and hyphens');
    } else {
      setValidationError('');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLoaded || !user) throw new Error('Not authenticated');

      if (!isValid) {
        throw new Error('Invalid project name');
      }

      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('project_name', projectName)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        showToast.error('You already have a project with this name');
        setLoading(false);
        return;
      }

      const toastId = showToast.loading('Creating project...');

      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          project_name: projectName,
          status: 'creating',
          step: 'validating',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const response = await fetch('/api/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to trigger workflow');
      }

      showToast.success('Project created! Redirecting...');
      setTimeout(() => router.push(`/project/${project.id}`), 500);
    } catch (err: any) {
      console.error('Create error:', err);
      showToast.error(err.message || 'Failed to create project');
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-black/80 text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-6 flex items-center gap-4">
        <Link href="/projects" className="hover:bg-white/10 p-2 rounded-lg transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={32} className="text-emerald-400" />
            <h2 className="text-3xl font-bold">Launch Your Instance</h2>
          </div>
          <p className="text-gray-400">Create a new self-hosted Supabase instance in minutes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="my-awesome-project"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-400">Lowercase letters, numbers, hyphens (3-30 chars)</p>
              {isValid && <CheckCircle2 size={16} className="text-emerald-400" />}
            </div>
            {validationError && (
              <p className="text-xs text-red-400 mt-2">{validationError}</p>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">What's included:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>PostgreSQL database with full RLS</li>
              <li>Real-time subscriptions</li>
              <li>Auth system (email, OAuth, SAML)</li>
              <li>Edge Functions</li>
              <li>Studio interface</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Zap size={20} />
                Create Project
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Typical timeline:</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex gap-2">
              <span className="text-emerald-400 min-w-fit">1-2 min:</span>
              <span>Infrastructure provisioning</span>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-400 min-w-fit">2-4 min:</span>
              <span>Services startup</span>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-400 min-w-fit">4-5 min:</span>
              <span>Ready to use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
