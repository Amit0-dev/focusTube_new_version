import {
  BarChart3,
  ChevronRight,
  Sparkles,
  Users,
  Video,
  Clock,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { UsersTab } from './UsersTab';
import { VideosTab } from './VideoTab';
import { AssignmentsTab } from './AssignmentsTab';
import type { Playlist } from '@/types/playlist';
import DashboardCard from '../learner-dashboard/DashboardCard';
import { getPlaylistByIdService } from '@/server/services/playlist.service';
import Image from 'next/image';
import { getJoinedUserCountOfCreatorPlaylist } from '@/server/dal/prisma/playlist.dal';

export default async function PlaylistDetailContent({ tab, playlistId }: { tab: string, playlistId: string }) {

  let playlist: Playlist | null = null;
  let userCount: number = 0;
  let errorMessage: string | null = null;

  try {
    playlist = await getPlaylistByIdService(playlistId)
    userCount = await getJoinedUserCountOfCreatorPlaylist(playlistId)
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch playlists';
  }

  if (errorMessage || !playlist) {
    return (
      <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
        <div className="text-sm font-semibold text-red-100">
          Could not load playlist
        </div>
        <div className="mt-1 text-sm text-red-100/70">{errorMessage}</div>
        {/* add a retry button here in case of error in future  */}
      </DashboardCard>
    );
  }

  return (
    <div className="flex min-h-full gap-6">
      {/* Main content area */}
      <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="text-white/60 hover:text-white transition cursor-pointer">
            Playlist spaces
          </span>
          <ChevronRight size={14} className="text-white/30" />
          <span className="font-medium text-white">{playlist.title}!</span>
        </div>

        {/* Playlist header card */}
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.06] to-white/[0.02] p-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            {/* Thumbnail */}
            <div className="relative h-36 w-60 flex-shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-red-700/70 via-orange-600/50 to-slate-900 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(0,0,0,0.5)_100%)]" >
                <Image
                  src={playlist.thumbnail}
                  alt="Playlist thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <Video size={10} className="text-cyan-300" />
                {playlist.itemCount} videos
              </div>
              <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <Users size={10} className="text-cyan-300" />
                <span>{userCount} learners</span>
              </div>

            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">{playlist.title}</h1>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {playlist.description}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                <span>
                  Created by{' '}
                  <span className="font-medium text-white/60">
                    <span className="text-white/70">{playlist.channelTitle}</span>
                  </span>
                </span>
                <span className="text-white/20">|</span>
                <span>
                  Created on{' '}
                  <span className="text-white/60">{new Date(playlist.publishedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {tab === 'videos' && <VideosTab playlistId={playlist.id} />}
        {tab === 'users' && <UsersTab playlistId={playlist.id} />}
        {tab === 'assignments' && <AssignmentsTab />}
      </div>

      {/* Right sidebar */}
      <div className="hidden w-72 flex-shrink-0 space-y-5 xl:block">
        {/* Playlist Overview */}
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.06] to-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white">Playlist Overview</h3>

          <div className="mt-4 space-y-4">
            {[
              {
                icon: Video,
                label: 'Total videos',
                value: playlist.itemCount,
                iconColor: 'text-cyan-400',
                bg: 'bg-cyan-400/10',
              },
              {
                icon: Users,
                label: 'Total learners',
                value: userCount,
                iconColor: 'text-pink-400',
                bg: 'bg-pink-400/10',
              },
              {
                icon: Clock,
                label: 'Total duration',
                value: "00:00",
                iconColor: 'text-amber-400',
                bg: 'bg-amber-400/10',
              },
            ].map(({ icon: Icon, label, value, iconColor, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    bg,
                  )}
                >
                  <Icon size={16} className={iconColor} />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-[11px] text-white/40">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
