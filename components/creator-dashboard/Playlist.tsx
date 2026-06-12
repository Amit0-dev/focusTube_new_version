import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import ImportPlaylistCard from '@/components/learner-dashboard/ImportPlaylistCard';
import SectionHeader from '@/components/learner-dashboard/SectionHeader';
import type { Playlist } from '@/types/playlist';

import CreatorPlaylistCard from './PlaylistCard';

export default async function CreatorPlaylist() {
  const previewPlaylist: Playlist = {
    id: 'preview-playlist',
    youtubePlaylistId: 'preview-playlist',
    userId: 'preview-user',
    title: 'Creator Masterclass Launch Kit',
    description:
      'A sample playlist space showing the creator card layout, metrics, and visual treatment.',
    channelId: 'preview-channel',
    publishedAt: new Date(),
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    channelTitle: 'FocusTube Studio',
    kind: 'youtube#playlist',
    itemCount: 18,
    status: 'IN_PROGRESS',
    completedVideosCount: 7,
  };

  const playlists: Playlist[] = [
    previewPlaylist,
    {
      id: 'preview-playlist-2',
      youtubePlaylistId: 'preview-playlist-2',
      userId: 'preview-user',
      title: 'Product Design Systems',
      description:
        'A second sample space for previewing the creator playlist grid.',
      channelId: 'preview-channel-2',
      publishedAt: new Date(),
      thumbnail:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      channelTitle: 'FocusTube Studio',
      kind: 'youtube#playlist',
      itemCount: 12,
      status: 'NEW',
      completedVideosCount: 2,
    },
  ];

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
            <ImportPlaylistCard />
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
