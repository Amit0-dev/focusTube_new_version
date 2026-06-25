import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import ImportPlaylistCard from '@/components/learner-dashboard/ImportPlaylistCard';
import SectionHeader from '@/components/learner-dashboard/SectionHeader';
import { getPlaylistOfCurrentUserService } from '@/server/services/playlist.service';
import type { Playlist } from '@/types/playlist';

import CreatorPlaylistCard from './PlaylistCard';
import { getPlaylistsOwnByCreatorService } from '@/server/services/creator.service';
import { AppError } from '@/lib/errors/appError';

export default async function CreatorPlaylist() {
  let playlists: Playlist[] = [];
  let errorMessage: string | null = null;

  try {
    playlists = await getPlaylistsOwnByCreatorService();
  } catch (error) {
    errorMessage = error instanceof AppError ? error.message : "Failed to fetch creator playlists"
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
          title="Playlist spaces"
          subtitle="Shape each playlist like a published space with clean ownership, audience signals, and instant import controls."
        />
        <ImportPlaylistCard />
      </div>

      {playlists.length === 0 ? (
        <DashboardCard className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-slate-900/10" />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">
                No playlist spaces yet
              </div>
              <div className="mt-1 max-w-xl text-sm text-white/60">
                Import a playlist to turn it into a creator space with audience
                metrics, shared sessions, and a polished management view.
              </div>
            </div>

          </div>
        </DashboardCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <CreatorPlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
