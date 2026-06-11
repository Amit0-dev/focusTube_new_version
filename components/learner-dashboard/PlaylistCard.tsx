'use client';

import { useRouter } from 'next/navigation';

import DashboardCard from './DashboardCard';
import ProgressBar from './ProgressBar';

const PlaylistCard = (p: {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string | null;
  itemCount: number;
  completedVideos?: number;
  status: 'IN_PROGRESS' | 'NEW' | 'COMPLETED';
}) => {
  const router = useRouter();
  const completedVideos = p.completedVideos ?? 0;

  console.log({
    itemCount: p.itemCount,
    completedVideos: completedVideos,
  })

  const progressValue =
    p.itemCount > 0 && p.completedVideos !== undefined
      ? Math.min(
          100,
          Math.max(0, Math.round((completedVideos / p.itemCount) * 100)),
        )
      : 0;

  console.log(
    `Playlist "${p.title}" progress: ${progressValue}% (${completedVideos}/${p.itemCount} videos completed)`,
  );

  const statusLabel: 'IN_PROGRESS' | 'NEW' | 'COMPLETED' = p.status;
  const statusStyles = {
    NEW: 'border-sky-400/20 bg-sky-400/12 text-sky-100 shadow-sky-500/10',
    IN_PROGRESS:
      'border-amber-400/20 bg-amber-400/12 text-amber-50 shadow-amber-500/10',
    COMPLETED:
      'border-emerald-400/20 bg-emerald-400/12 text-emerald-50 shadow-emerald-500/10',
  } as const;

  const statusDotStyles = {
    NEW: 'bg-sky-300',
    IN_PROGRESS: 'bg-amber-300',
    COMPLETED: 'bg-emerald-300',
  } as const;

  return (
    <div onClick={() => router.push(`/learner/playlist/${p.id}`)}>
      <DashboardCard
        key={p.id}
        className="group relative flex h-full flex-col overflow-hidden border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-400/20 hover:bg-white/8"
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 ring-1 ring-white/5">
          {p.thumbnail ? (
            <img
              src={p.thumbnail}
              alt={p.title}
              className="h-full w-full object-cover opacity-95 transition-transform duration-300 scale-[0.98] group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-orange-500/20 to-amber-400/10" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/0" />

          <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
            {p.itemCount} videos
          </div>

          <div className="absolute right-3 top-3 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
            {progressValue}% done
          </div>

          <div
            className={`absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-lg backdrop-blur-md ${statusStyles[statusLabel]}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusDotStyles[statusLabel]}`}
            />
            <span>{statusLabel.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="relative mt-4 flex flex-1 flex-col gap-4">
          <div className="min-w-0">
            <div className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-[1.05rem]">
              {p.title}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span className="truncate">{p.channelTitle}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-flex" />
              <span className="text-white/45">Learning playlist</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-inner shadow-black/10 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Playlist progress
              </span>
              <span className="text-sm font-semibold text-white/90">
                {progressValue}%
              </span>
            </div>
            <ProgressBar
              value={progressValue}
              className="[&>div]:h-2.5 [&>div>div]:h-2.5"
            />
            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-white/55 sm:text-xs">
              <span className="truncate">
                {completedVideos} of {p.itemCount} videos completed
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/65">
                {p.itemCount} total
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-white/55">
              Pick up where you left off
            </span>
            <button
              type="button"
              suppressHydrationWarning
              className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 sm:w-auto"
            >
              Open
            </button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default PlaylistCard;
