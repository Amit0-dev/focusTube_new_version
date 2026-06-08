'use client';

import { useRouter } from 'next/navigation';

import DashboardCard from './DashboardCard';

const PlaylistCard = (p: {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string | null;
  itemCount: number;
}) => {
  const router = useRouter();

  return (
    <div onClick={() => router.push(`/learner/playlist/${p.id}`)}>
      <DashboardCard
        key={p.id}
        className="group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:bg-white/7"
      >
        <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {p.thumbnail ? (
            <img
              src={p.thumbnail}
              alt={p.title}
              className="h-full w-full object-cover opacity-95 transition-transform duration-200 scale-[0.96] group-hover:scale-[0.98]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-orange-500/20 to-amber-400/10" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-black/0" />

          <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur">
            {p.itemCount} videos
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {p.title}
            </div>
            <div className="mt-1 truncate text-xs text-white/60">
              {p.channelTitle}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-white/60">{p.itemCount} videos</span>
          <button
            type="button"
            suppressHydrationWarning
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
          >
            Open
          </button>
        </div>
      </DashboardCard>
    </div>
  );
};

export default PlaylistCard;
