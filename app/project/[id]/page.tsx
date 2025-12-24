'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase, Project } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Trash2, Loader2, AlertCircle, ExternalLink, Server, Lock, Database, Key, Shield } from 'lucide-react';
import { showToast } from '@/lib/toast';

const STEP_MESSAGES: Record<string, string> = {
  validating: '🔍 Validating project configuration...',
  creating_service: '🏗️ Creating infrastructure...',
  starting_service: '🚀 Starting services...',
  deploying: '📦 Deploying Supabase containers...',
  waiting_for_health: '⏳ Waiting for services to be ready...',
  finalizing: '✨ Finalizing setup and extracting credentials...',
  ready: '✅ Project is ready!',
};

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProject();

    const interval = setInterval(() => {
      if (!project || project.status !== 'ready') {
        fetchProject();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      showToast.error('Failed to copy');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setShowDeleteConfirm(false);

    showToast.loading('Deleting project...');
    try {
      const response = await fetch('/api/delete-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      showToast.success('Project deleted successfully');
      setTimeout(() => router.push('/projects'), 500);
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast.error(err.message || 'Failed to delete project');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-400" size={40} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error || 'Project not found'}</p>
          <Link href="/projects" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 justify-center">
            <ArrowLeft size={20} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Project is ready
  if (project.status === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-emerald-950/20 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-40 bg-black/50">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <Link href="/projects" className="hover:bg-white/10 p-2 rounded-lg transition">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{project.project_name}</h1>
                <p className="text-gray-400 mt-1">
                  Created {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded-lg transition"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={24} className="text-red-400" />
                <h2 className="text-2xl font-bold">Delete Project?</h2>
              </div>
              <p className="text-gray-400 mb-6">
                This will permanently delete <span className="font-semibold text-white">{project.project_name}</span> and all its data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          {/* Quick Access Card */}
          <div className="mb-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <Server size={24} className="text-emerald-400" />
              <div>
                <h3 className="text-xl font-bold">Supabase Studio</h3>
                <p className="text-sm text-gray-400">Open your database dashboard</p>
              </div>
            </div>
            {project.studio_url && (
              <>
                <a
                  href={project.studio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition transform hover:scale-105"
                >
                  <ExternalLink size={18} />
                  Open Studio
                </a>
                <p className="text-xs text-gray-400 mt-3 break-all">
                  {project.studio_url}
                </p>
              </>
            )}
          </div>

          {/* Credentials Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Admin Credentials */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-purple-500/30 transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Lock size={20} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Admin Credentials</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 font-semibold mb-2">Admin Username</label>
                  <button
                    onClick={() => copyToClipboard(project.admin_username || '', 'admin_username')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-lg hover:bg-white/10 transition group"
                  >
                    <code className="text-sm text-purple-400 font-mono break-all text-left">
                      {project.admin_username}
                    </code>
                    {copiedField === 'admin_username' ? (
                      <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 font-semibold mb-2">Admin Password</label>
                  <button
                    onClick={() => copyToClipboard(project.admin_password || '', 'admin_password')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-lg hover:bg-white/10 transition group"
                  >
                    <code className="text-sm text-purple-400 font-mono break-all text-left">
                      {project.admin_password}
                    </code>
                    {copiedField === 'admin_password' ? (
                      <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Database Credentials */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-blue-500/30 transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Database size={20} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Database</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 font-semibold mb-2">PostgreSQL Password</label>
                  <button
                    onClick={() => copyToClipboard(project.postgres_password || '', 'postgres_password')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-lg hover:bg-white/10 transition group"
                  >
                    <code className="text-sm text-blue-400 font-mono break-all text-left">
                      {project.postgres_password}
                    </code>
                    {copiedField === 'postgres_password' ? (
                      <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-cyan-500/30 transition lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Key size={20} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold">API Keys</h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 font-semibold mb-2">Anon Key (Public)</label>
                  <button
                    onClick={() => copyToClipboard(project.anon_key || '', 'anon_key')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded-lg hover:bg-white/10 transition group text-left"
                  >
                    <code className="text-xs text-cyan-400 font-mono break-all">
                      {project.anon_key}
                    </code>
                    {copiedField === 'anon_key' ? (
                      <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 font-semibold mb-2">Service Key (Secret)</label>
                  <button
                    onClick={() => copyToClipboard(project.service_key || '', 'service_key')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded-lg hover:bg-white/10 transition group text-left"
                  >
                    <code className="text-xs text-cyan-400 font-mono break-all">
                      {project.service_key}
                    </code>
                    {copiedField === 'service_key' ? (
                      <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* JWT Secret */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl hover:border-pink-500/30 transition lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Shield size={20} className="text-pink-400" />
                </div>
                <h3 className="text-xl font-bold">JWT Secret</h3>
              </div>
              <button
                onClick={() => copyToClipboard(project.jwt_secret || '', 'jwt_secret')}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-pink-500/50 rounded-lg hover:bg-white/10 transition group text-left"
              >
                <code className="text-xs text-pink-400 font-mono break-all">
                  {project.jwt_secret}
                </code>
                {copiedField === 'jwt_secret' ? (
                  <Check size={18} className="text-emerald-400 flex-shrink-0 ml-2" />
                ) : (
                  <Copy size={18} className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl text-center text-sm text-gray-400">
            <p>💾 All credentials are stored securely in your database</p>
            <p className="text-xs mt-2">🔒 Never share your secrets with anyone</p>
          </div>
        </div>
      </div>
    );
  }

  // Project is still creating
  const steps = [
    { key: 'validating', label: 'Configuration', icon: '🔍' },
    { key: 'creating_service', label: 'Infrastructure', icon: '🏗️' },
    { key: 'starting_service', label: 'Services', icon: '🚀' },
    { key: 'deploying', label: 'Containers', icon: '📦' },
    { key: 'waiting_for_health', label: 'Health Check', icon: '⏳' },
    { key: 'finalizing', label: 'Finalize', icon: '✨' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === project.step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const elapsedSeconds = Math.floor((Date.now() - new Date(project.created_at).getTime()) / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-emerald-950/20 text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/5">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl rounded-2xl p-10 shadow-2xl">
          {/* Animated icon */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-400" size={64} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {project.project_name}
          </h1>
          <p className="text-center text-gray-400 mb-8 text-lg">
            Building your Supabase instance...
          </p>

          {/* Current step message */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 text-center">
            <p className="text-emerald-300 font-semibold text-lg">
              {STEP_MESSAGES[project.step] || '⚙️ Processing...'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 font-medium">Progress</span>
              <span className="text-sm text-emerald-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps timeline */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-4">Deployment Steps</h3>
            <div className="space-y-2">
              {steps.map((step, index) => {
                const isActive = step.key === project.step;
                const isComplete = currentStepIndex > index;

                return (
                  <div key={step.key} className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive ? 'bg-emerald-500/20 border border-emerald-500/50' :
                    isComplete ? 'bg-white/5 border border-white/10' :
                    'bg-white/5 border border-white/10 opacity-50'
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isComplete ? 'bg-emerald-500 text-black' :
                      isActive ? 'bg-emerald-400 text-black animate-pulse' :
                      'bg-white/20 text-gray-400'
                    }`}>
                      {isComplete ? '✓' : step.icon[0]}
                    </div>
                    <span className={`flex-1 text-sm font-medium ${
                      isActive ? 'text-white' :
                      isComplete ? 'text-gray-300' :
                      'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {isActive && <div className="flex-shrink-0 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info box */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg font-bold text-emerald-400 capitalize">{project.status}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Elapsed</p>
              <p className="text-lg font-bold text-cyan-400">{elapsedMinutes}:{String(elapsedSeconds % 60).padStart(2, '0')}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">ETA</p>
              <p className="text-lg font-bold text-gray-300">~2-4 min</p>
            </div>
          </div>

          {/* Helper text */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              ✨ Don't close this page. Your Supabase instance is being provisioned in real-time.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Started at {new Date(project.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
