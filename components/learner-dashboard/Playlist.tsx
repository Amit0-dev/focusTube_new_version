import { getUserPlaylists } from '@/lib/services/playlist.service';

import DashboardCard from './DashboardCard';
import SectionHeader from './SectionHeader';
import TagPill from './TagPill';

export default async function Playlist() {
  const playlists = await getUserPlaylists();

  console.log('User playlists:', playlists);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Playlists"
        subtitle="Browse your learning queue and pick your next session."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {playlists.map((p) => (
          <DashboardCard
            key={p.id}
            className="p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="h-32 w-full rounded-2xl border border-white/10 bg-linear-to-br from-orange-500/20 to-amber-400/10" />

            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  {p.title}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {p.channelTitle}
                </div>
              </div>
              <TagPill tag={'New'} />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <span>{p.itemCount} videos</span>
              <button
                type="button"
                suppressHydrationWarning
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
              >
                Open
              </button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
