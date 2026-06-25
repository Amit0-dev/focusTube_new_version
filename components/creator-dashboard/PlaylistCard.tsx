"use client"

import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import type { Playlist } from '@/types/playlist';
import {
  Layers3,
  Users2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatorPlaylistCard({
  playlist,
}: {
  playlist: Playlist;
}) {

  const router = useRouter()

  return (
    <div onClick={() => { router.push(`/creator/playlist/${playlist.id}`) }}>
      <DashboardCard className="group relative overflow-hidden border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative aspect-16/10 w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 ring-1 ring-white/5">
          {playlist.thumbnail ? (
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="h-full w-full scale-[0.98] object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-cyan-500/20 via-sky-400/10 to-slate-950" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-black/0" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
            <Layers3 size={12} className="text-cyan-300" />
            {playlist.itemCount} videos
          </div>
        </div>

        <div className="relative mt-4 space-y-4">
          <div className="min-w-0">
            <div className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-[1.05rem]">
              {playlist.title}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span className="truncate">{playlist.channelTitle}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-flex" />
              <span className="text-white/45">Creator playlist space</span>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
