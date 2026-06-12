import { ArrowRight, BadgeCheck, Sparkles, Users2 } from 'lucide-react';

import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import type { Playlist } from '@/types/playlist';

export default function CreatorDashboard() {
  const playlists: Playlist[] = [
    {
      id: 'preview-playlist',
      youtubePlaylistId: 'preview-playlist',
      userId: 'preview-user',
      title: 'Creator Masterclass Launch Kit',
      description:
        'A sample playlist space showing audience metrics and creator UI.',
      channelId: 'preview-channel',
      publishedAt: new Date(),
      thumbnail:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      channelTitle: 'FocusTube Studio',
      kind: 'youtube#playlist',
      itemCount: 18,
      status: 'IN_PROGRESS',
      completedVideosCount: 7,
    },
    {
      id: 'preview-playlist-2',
      youtubePlaylistId: 'preview-playlist-2',
      userId: 'preview-user',
      title: 'Product Design Systems',
      description: 'A second sample space for dashboard metrics.',
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

  const totalPlaylists = playlists.length;
  const totalVideos = playlists.reduce((sum, playlist) => sum + playlist.itemCount, 0);
  const connectedLearners = Math.max(84, totalVideos * 14 + totalPlaylists * 38);
  const activeSpaces = Math.max(1, totalPlaylists);
  const weeklySessions = Math.max(24, totalVideos * 7 + totalPlaylists * 20);
  const averageNotes = Math.max(6, Math.round(totalVideos / 2) + totalPlaylists * 3);
  const topPlaylist = playlists[0];

  const statCards = [
    {
      label: 'Connected learners',
      value: connectedLearners.toLocaleString(),
      detail: 'Creators and learners actively tied to your spaces',
      accent: 'from-cyan-500/25 to-sky-400/10',
      icon: Users2,
    },
    {
      label: 'Active spaces',
      value: activeSpaces.toString(),
      detail: 'Published playlists available for audience access',
      accent: 'from-emerald-500/20 to-teal-400/10',
      icon: BadgeCheck,
    },
    {
      label: 'Weekly sessions',
      value: weeklySessions.toLocaleString(),
      detail: 'Estimated watch and revisit activity this week',
      accent: 'from-amber-500/20 to-orange-400/10',
      icon: Sparkles,
    },
    {
      label: 'Shared notes',
      value: averageNotes.toLocaleString(),
      detail: 'Captured takeaways across your library',
      accent: 'from-fuchsia-500/20 to-pink-400/10',
      icon: ArrowRight,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Creator studio
        </h1>
        <p className="max-w-3xl text-sm text-white/60">
          Manage playlist spaces, measure connected learners, and keep the
          whole creator experience feeling like a polished SaaS product.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <DashboardCard className="relative overflow-hidden lg:col-span-8">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/18 via-sky-400/8 to-slate-900/10" />
          <div className="relative p-6 md:p-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Sparkles size={14} className="text-cyan-300" />
                  Audience overview
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Your creator spaces are live
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Track the number of connected learners, how many people are in
                  each playlist space, and which collections are getting the
                  most traction.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {statCards.slice(0, 2).map(({ label, value, detail, accent, icon: Icon }) => (
                    <div
                      key={label}
                      className={`rounded-[1.5rem] border border-white/10 bg-linear-to-br ${accent} p-4`}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                        <Icon size={14} className="text-cyan-200" />
                        {label}
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-white">
                        {value}
                      </div>
                      <p className="mt-2 text-sm text-white/65">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {['Learner reach', 'Playlist spaces', 'Live imports', 'Shared notes'].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="relative w-full md:w-64">
                <div className="rounded-[1.75rem] border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-5 shadow-2xl shadow-cyan-500/10">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                    Top playlist
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {topPlaylist?.title ?? 'Import your first space'}
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    {topPlaylist?.channelTitle ?? 'No playlist yet'}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        Videos
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white">
                        {topPlaylist?.itemCount ?? 0}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        Reach
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white">
                        {topPlaylist ? Math.max(24, topPlaylist.itemCount * 16) : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <div className="space-y-4 lg:col-span-4">
          {statCards.slice(2).map(({ label, value, detail, accent, icon: Icon }) => (
            <DashboardCard key={label} className={`overflow-hidden border-white/10 bg-linear-to-br ${accent} p-5`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                    <Icon size={12} className="text-cyan-200" />
                    {label}
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">
                    {value}
                  </div>
                  <p className="mt-2 text-sm text-white/65">{detail}</p>
                </div>
              </div>
            </DashboardCard>
          ))}

          <DashboardCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Creator health
                </div>
                <div className="mt-1 text-xs text-white/60">
                  A quick pulse on your library and audience flow.
                </div>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                Stable
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Imported spaces', value: `${totalPlaylists}` },
                { label: 'Content volume', value: `${totalVideos} videos` },
                { label: 'Audience depth', value: `${connectedLearners.toLocaleString()} learners` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="text-sm text-white/60">{item.label}</div>
                  <div className="text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
