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

const PLAYLIST = {
  title: 'The DEAD Series!',
  subtitle: 'Published playlist space',
  description:
    'Playlist focusing on the grow, watch audience growth, and manage imports in one place.',
  createdBy: 'FocusTube',
  createdOn: 'May 5, 2026',
  lastUpdated: 'May 20, 2026',
  totalVideos: 10,
  totalLearners: 254,
  totalDuration: '5h 36m',
};

export default function PlaylistDetailContent({ tab }: { tab: string }) {
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
          <span className="font-medium text-white">The DEAD Series!</span>
        </div>

        {/* Playlist header card */}
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.06] to-white/[0.02] p-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            {/* Thumbnail */}
            <div className="relative h-36 w-60 flex-shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-red-700/70 via-orange-600/50 to-slate-900 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
              <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <Video size={10} className="text-cyan-300" />
                10 videos
              </div>
              <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <Users size={10} className="text-cyan-300" />
                254 learners
              </div>
              <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-50 backdrop-blur-sm">
                <Sparkles size={10} className="text-cyan-200" />
                Shared Space
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">{PLAYLIST.title}</h1>
                <p className="mt-0.5 text-sm text-white/50">{PLAYLIST.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {PLAYLIST.description}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                <span>
                  Created by{' '}
                  <span className="font-medium text-white/60">
                    F{' '}
                    <span className="text-white/70">{PLAYLIST.createdBy}</span>
                  </span>
                </span>
                <span className="text-white/20">|</span>
                <span>
                  Created on{' '}
                  <span className="text-white/60">{PLAYLIST.createdOn}</span>
                </span>
                <span className="text-white/20">|</span>
                <span>
                  Last updated{' '}
                  <span className="text-white/60">{PLAYLIST.lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {tab === 'videos' && <VideosTab />}
        {tab === 'users' && <UsersTab />}
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
                value: PLAYLIST.totalVideos,
                iconColor: 'text-cyan-400',
                bg: 'bg-cyan-400/10',
              },
              {
                icon: Users,
                label: 'Total learners',
                value: PLAYLIST.totalLearners,
                iconColor: 'text-pink-400',
                bg: 'bg-pink-400/10',
              },
              {
                icon: Clock,
                label: 'Total duration',
                value: PLAYLIST.totalDuration,
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

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            <BarChart3 size={15} className="text-cyan-400" />
            View analytics
          </button>
        </div>

        {/* Invite Users */}
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.06] to-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white">Invite Users</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/40">
            Add creators, editors, or learners to collaborate on this playlist.
          </p>
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
          >
            <UserPlus size={15} />
            Invite users
          </button>
        </div>
      </div>
    </div>
  );
}
