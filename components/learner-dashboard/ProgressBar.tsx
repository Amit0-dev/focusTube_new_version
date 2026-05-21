import { cn } from '@/lib/cn';

export default function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)} aria-label={`Progress ${clamped}%`}>
      <div className="h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-linear-to-r from-orange-400 to-amber-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
