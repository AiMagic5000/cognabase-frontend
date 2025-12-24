interface BadgeProps {
  variant: 'ready' | 'creating' | 'failed';
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const styles = {
    ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    creating: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
}
