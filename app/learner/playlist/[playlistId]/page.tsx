import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import SectionHeader from '@/components/learner-dashboard/SectionHeader';
import PlaylistWorkspace from '@/components/learner-playlist/PlaylistWorkspace';
import { getPlaylistByIdService } from '@/server/services/playlist.service';
import { getVideosByPlaylistIdService } from '@/server/services/video.service';

export default async function PlaylistVideos({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  try {
    const { playlistId } = await params;

    const videos = await getVideosByPlaylistIdService(playlistId);
    const playlist = await getPlaylistByIdService(playlistId);

    if (!playlist) {
      return (
        <div className="space-y-6">
          <SectionHeader
            title="Playlist"
            subtitle="This playlist is unavailable or you do not have access."
          />
          <DashboardCard className="p-6">
            <div className="text-sm font-semibold text-white">
              Playlist not found
            </div>
            <div className="mt-1 text-sm text-white/60">
              Open another playlist from your learner dashboard.
            </div>
          </DashboardCard>
        </div>
      );
    }

    return <PlaylistWorkspace videos={videos} playlist={playlist} />;
  } catch (error) {
    console.error('Failed to load playlist page:', error);

    return (
      <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
        <div className="text-sm font-semibold text-red-100">
          Could not load playlist
        </div>
        <div className="mt-1 text-sm text-red-100/70">
          Please try again from your dashboard.
        </div>
      </DashboardCard>
    );
  }
}
