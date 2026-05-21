import { cn } from '@/lib/cn';

export default function DashboardCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
