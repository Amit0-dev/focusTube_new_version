import { getUserPlaylists } from '@/lib/services/playlist.service';
import { ArrowRight, Flame, Play, Sparkles } from 'lucide-react';

import CircularProgress from './CircularProgress';
import DashboardCard from './DashboardCard';
import ProgressBar from './ProgressBar';
import TagPill from './TagPill';

export default async function Dashboard() {
  const playlists = await getUserPlaylists();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Welcome back, Learner 👋
        </h1>
        <p className="text-sm text-white/60">
          Small progress daily beats occasional intensity. Let’s keep the
          momentum going.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <DashboardCard className="relative overflow-hidden lg:col-span-8">
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-amber-400/10 to-slate-900/10" />
          <div className="relative p-6 md:p-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Sparkles size={14} className="text-orange-300" />
                  Continue Learning
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Complete Web Development
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Instructor: CodeCraft Academy
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Build modern web apps end-to-end: responsive UI, React
                  patterns, APIs, and deployment.
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                    <span>Progress</span>
                    <span>42%</span>
                  </div>
                  <ProgressBar value={42} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {['React', 'JavaScript', 'Node', 'CSS', 'Next.js'].map(
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

                <div className="mt-6">
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95"
                  >
                    <Play size={16} />
                    Resume Playlist
                    <ArrowRight size={16} className="opacity-80" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="h-44 w-full rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-4 md:h-52 md:w-56">
                  <div className="text-xs font-semibold text-white/70">
                    Next up
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    Build a REST API
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    Auth, validation, and routes
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl bg-orange-500/20 ring-1 ring-white/10" />
                    <div className="h-10 w-10 rounded-2xl bg-amber-400/15 ring-1 ring-white/10" />
                    <div className="h-10 w-10 rounded-2xl bg-orange-300/10 ring-1 ring-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <div className="space-y-6 lg:col-span-4">
          <DashboardCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  Your Progress
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Weekly completion goal
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <CircularProgress value={72} />
            </div>
            <div className="mt-5 text-center text-xs text-white/60">
              You’re ahead of last week. Keep it up.
            </div>
          </DashboardCard>

          <DashboardCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Learning Streak
                </div>
                <div className="mt-1 text-xs text-white/60">
                  Consistency is everything.
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                <Flame size={14} className="text-orange-300" />7 days 🔥
              </div>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              View My Progress
              <ArrowRight size={16} className="opacity-80" />
            </button>
          </DashboardCard>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Playlists</h3>
            <p className="text-sm text-white/60">
              Pick up where you left off or start something new.
            </p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
          {playlists.map((p) => (
            <DashboardCard
              key={p.id}
              className="min-w-65 shrink-0 p-4 transition hover:-translate-y-0.5 hover:bg-white/10 md:min-w-0"
            >
              <div className="h-28 w-full rounded-2xl border border-white/10 bg-linear-to-br from-orange-500/20 to-amber-400/10" />

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

              <div className="mt-3 text-xs text-white/60">
                {p.itemCount} videos
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>
    </div>
  );
}
