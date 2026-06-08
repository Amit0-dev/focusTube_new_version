import { getPlaylistOfCurrentUserService } from '@/server/services/playlist.service';
import type { Playlist } from '@/types/playlist';

import DashboardCard from './DashboardCard';
import ImportPlaylistCard from './ImportPlaylistCard';
import PlaylistCard from './PlaylistCard';
import SectionHeader from './SectionHeader';

export default async function Playlist() {
  let playlists: Playlist[] = [];
  let errorMessage: string | null = null;

  try {
    playlists = await getPlaylistOfCurrentUserService();
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch playlists';
  }

  if (errorMessage) {
    return (
      <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
        <div className="text-sm font-semibold text-red-100">
          Could not load playlists
        </div>
        <div className="mt-1 text-sm text-red-100/70">{errorMessage}</div>
        {/* add a retry button here in case of error in future  */}
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          title="Playlists"
          subtitle="Browse your learning queue and pick your next session."
        />
        <ImportPlaylistCard />
      </div>

      {playlists.length === 0 ? (
        <DashboardCard className="p-6">
          <div className="text-sm font-semibold text-white">
            No playlists yet
          </div>
          <div className="mt-1 text-sm text-white/60">
            Import a YouTube playlist to get started.
          </div>
        </DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              channelTitle={p.channelTitle}
              id={p.id}
              itemCount={p.itemCount}
              thumbnail={p.thumbnail}
              title={p.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
