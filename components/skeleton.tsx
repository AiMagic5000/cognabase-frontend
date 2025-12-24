export function SkeletonLoader() {
  return (
    <div className="animate-pulse rounded-lg bg-white/5 h-12 w-full" />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
      <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
      <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse" />
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
