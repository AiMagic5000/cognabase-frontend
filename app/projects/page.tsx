'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, UserButton, SignedIn } from '@clerk/nextjs';
import { supabase, Project } from '@/lib/supabase';
import { Plus, Loader2, Clock, CheckCircle2, AlertCircle, Sparkles, Search } from 'lucide-react';
import { SkeletonGrid } from '@/components/skeleton';
import { Badge } from '@/components/badge';
import { showToast } from '@/lib/toast';

const PROJECTS_PER_PAGE = 6;

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/');
      return;
    }

    fetchProjects();
  }, [user, isLoaded, router]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      showToast.error('Failed to load projects');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate
  const filteredProjects = useMemo(
    () => projects.filter((p) => p.project_name.toLowerCase().includes(searchTerm.toLowerCase())),
    [projects, searchTerm]
  );

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'creating':
        return <Clock size={20} className="text-yellow-400 animate-pulse" />;
      case 'ready':
        return <CheckCircle2 size={20} className="text-emerald-400" />;
      case 'failed':
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return null;
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles size={28} className="text-emerald-400" />
                Projects
              </h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-emerald-950/20 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-40 bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg">
                  <Sparkles size={24} className="text-emerald-400" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Projects</h1>
              </div>
              <p className="text-gray-400 ml-11">{filteredProjects.length} instance(s) • Self-hosted Supabase</p>
            </div>
            <div className="flex gap-4 items-center relative z-10">
              <Link
                href="/create"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition transform hover:scale-105"
              >
                <Plus size={20} />
                New Project
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b border-white/10 bg-black/30 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="relative group">
              <Search size={20} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition" />
              <input
                type="text"
                placeholder="Search projects by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 group-focus-within:border-emerald-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl backdrop-blur-xl">
              <div className="mb-4 inline-flex p-4 bg-emerald-500/10 rounded-full">
                <Sparkles size={48} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">No projects yet</h2>
              <p className="text-gray-400 mb-8">Create your first self-hosted Supabase instance to get started</p>
              <Link
                href="/create"
                className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition transform hover:scale-105"
              >
                Create First Project
              </Link>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No projects match "{searchTerm}"</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="group block bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-emerald-500/50 rounded-2xl p-6 hover:bg-white/15 hover:shadow-2xl hover:shadow-emerald-500/10 transition duration-300 transform group-hover:scale-105 backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold group-hover:text-emerald-400 transition truncate">
                          {project.project_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusIcon(project.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <Badge variant={project.status as any}>{project.status}</Badge>
                      {project.step && project.status === 'creating' && (
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">{project.step.replace(/_/g, ' ')}</span>
                      )}
                    </div>

                    {project.status === 'ready' && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg text-xs">
                        <p className="text-emerald-300 font-semibold mb-1 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Ready to use
                        </p>
                        <p className="text-gray-400">Click to view credentials and details</p>
                      </div>
                    )}

                    {project.status === 'failed' && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs">
                        <p className="text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle size={14} /> Creation failed
                        </p>
                      </div>
                    )}

                    {project.status === 'creating' && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs">
                        <p className="text-yellow-300 font-semibold flex items-center gap-1">
                          <Clock size={14} /> Creating
                        </p>
                        <p className="text-gray-400">Check back in a few minutes</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 hover:border-emerald-500/50 disabled:opacity-30 transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg transition font-semibold ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50'
                          : 'border border-white/20 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 hover:border-emerald-500/50 disabled:opacity-30 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SignedIn>
  );
}
