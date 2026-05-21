'use client';

import { useSearchParams } from 'next/navigation';

import { ArrowRight, Flame, Play, Sparkles } from 'lucide-react';

import CircularProgress from '@/components/learner-dashboard/CircularProgress';
import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import ProgressBar from '@/components/learner-dashboard/ProgressBar';

const playlists = [
  {
    id: 'p1',
    title: 'Complete Web Development',
    author: 'CodeCraft Academy',
    videos: 128,
    tag: 'In Progress',
  },
  {
    id: 'p2',
    title: 'React Mastery Sprint',
    author: 'DevNova',
    videos: 42,
    tag: 'Popular',
  },
  {
    id: 'p3',
    title: 'JavaScript Deep Dive',
    author: 'Frontend Forge',
    videos: 66,
    tag: 'New',
  },
  {
    id: 'p4',
    title: 'Node + APIs in Practice',
    author: 'Backend Bytes',
    videos: 38,
    tag: 'Popular',
  },
  {
    id: 'p5',
    title: 'CSS & Layout Systems',
    author: 'PixelSchool',
    videos: 24,
    tag: 'New',
  },
] as const;

const continueWatching = [
  {
    id: 'v1',
    title: 'Flexbox & Grid Foundations',
    duration: '12:48',
    progress: 64,
  },
  {
    id: 'v2',
    title: 'React State & Effects (Real Patterns)',
    duration: '18:03',
    progress: 28,
  },
  {
    id: 'v3',
    title: 'Node REST API: Auth & Validation',
    duration: '22:10',
    progress: 47,
  },
  {
    id: 'v4',
    title: 'Deploying Next.js (Checklist)',
    duration: '09:31',
    progress: 12,
  },
] as const;

function TagPill({ tag }: { tag: 'New' | 'Popular' | 'In Progress' }) {
  const styles =
    tag === 'New'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
      : tag === 'Popular'
        ? 'border-orange-400/20 bg-orange-400/10 text-orange-200'
        : 'border-amber-400/20 bg-amber-400/10 text-amber-200';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}>
      {tag}
    </span>
  );
}

export default function LearnerDashboardPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'dashboard';

  function renderDashboard() {
    return (
      <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Welcome back, Learner 👋
        </h1>
        <p className="text-sm text-white/60">
          Small progress daily beats occasional intensity. Let’s keep the momentum going.
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
                <p className="mt-1 text-sm text-white/60">Instructor: CodeCraft Academy</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Build modern web apps end-to-end: responsive UI, React patterns, APIs, and deployment.
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                    <span>Progress</span>
                    <span>42%</span>
                  </div>
                  <ProgressBar value={42} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {['React', 'JavaScript', 'Node', 'CSS', 'Next.js'].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {t}
                    </span>
                  ))}
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
                  <div className="text-xs font-semibold text-white/70">Next up</div>
                  <div className="mt-2 text-sm font-semibold text-white">Build a REST API</div>
                  <div className="mt-1 text-xs text-white/60">Auth, validation, and routes</div>
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
                <div className="text-sm font-semibold text-white">Your Progress</div>
                <div className="mt-1 text-xs text-white/60">Weekly completion goal</div>
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
                <div className="text-sm font-semibold text-white">Learning Streak</div>
                <div className="mt-1 text-xs text-white/60">Consistency is everything.</div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                <Flame size={14} className="text-orange-300" />
                7 days 🔥
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
            <p className="text-sm text-white/60">Pick up where you left off or start something new.</p>
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
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <div className="mt-1 text-xs text-white/60">{p.author}</div>
                </div>
                <TagPill tag={p.tag} />
              </div>

              <div className="mt-3 text-xs text-white/60">{p.videos} videos</div>
            </DashboardCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Continue Watching</h3>
          <p className="text-sm text-white/60">Finish these and keep your streak alive.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {continueWatching.map((v) => (
            <DashboardCard
              key={v.id}
              className="overflow-hidden transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <div className="relative h-32 w-full bg-linear-to-br from-white/10 to-white/5">
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70">
                  {v.duration}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-xs text-white/60">Progress {v.progress}%</div>
                  <ProgressBar value={v.progress} className="mt-2" />
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm font-semibold text-white">{v.title}</div>
                <button
                  type="button"
                  suppressHydrationWarning
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Resume
                  <ArrowRight size={14} className="opacity-80" />
                </button>
              </div>
            </DashboardCard>
          ))}
        </div>
      </section>
      </div>
    );
  }

  function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    );
  }

  function renderPlaylists() {
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
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <div className="mt-1 text-xs text-white/60">{p.author}</div>
                </div>
                <TagPill tag={p.tag} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>{p.videos} videos</span>
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

  function renderProgress() {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="My Progress"
          subtitle="Track consistency and completion over time."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <DashboardCard className="p-6 lg:col-span-5">
            <div className="text-sm font-semibold text-white">Overall Progress</div>
            <div className="mt-1 text-xs text-white/60">Based on your weekly goal</div>
            <div className="mt-6 flex items-center justify-center">
              <CircularProgress value={72} />
            </div>
          </DashboardCard>

          <DashboardCard className="p-6 lg:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Learning Streak</div>
                <div className="mt-1 text-xs text-white/60">Consistency compounds.</div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                <Flame size={14} className="text-orange-300" />
                7 days 🔥
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[{ k: 'Videos watched', v: '18' }, { k: 'Minutes learned', v: '246' }, { k: 'Playlists started', v: '3' }, { k: 'Notes taken', v: '12' }].map(
                (s) => (
                  <div
                    key={s.k}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-xs text-white/60">{s.k}</div>
                    <div className="mt-1 text-lg font-semibold text-white">{s.v}</div>
                  </div>
                ),
              )}
            </div>

            <button
              type="button"
              suppressHydrationWarning
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95"
            >
              View Weekly Report
              <ArrowRight size={16} className="opacity-80" />
            </button>
          </DashboardCard>
        </div>
      </div>
    );
  }

  function renderSavedVideos() {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Saved Videos"
          subtitle="Quick access to videos you want to revisit."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {continueWatching.map((v) => (
            <DashboardCard key={v.id} className="overflow-hidden p-0">
              <div className="relative h-32 w-full bg-linear-to-br from-white/10 to-white/5">
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70">
                  {v.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-white">{v.title}</div>
                <div className="mt-3">
                  <ProgressBar value={v.progress} />
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>
    );
  }

  function renderSimpleList(title: string, subtitle: string, items: string[]) {
    return (
      <div className="space-y-6">
        <SectionHeader title={title} subtitle={subtitle} />

        <DashboardCard className="p-6">
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-sm font-medium text-white">{it}</div>
                <button
                  type="button"
                  suppressHydrationWarning
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    );
  }

  if (tab === 'dashboard') return renderDashboard();
  if (tab === 'playlists') return renderPlaylists();
  if (tab === 'progress') return renderProgress();
  if (tab === 'saved') return renderSavedVideos();
  if (tab === 'notes')
    return renderSimpleList('Notes', 'Capture key takeaways while you learn.', [
      'React State Patterns',
      'CSS Layout Checklist',
      'API Auth Notes',
      'Deployment Checklist',
    ]);
  if (tab === 'bookmarks')
    return renderSimpleList('Bookmarks', 'Handy links and time-stamps to revisit.', [
      'Next.js App Router Guide',
      'React Hooks Cheatsheet',
      'HTTP Status Codes',
      'Node Security Basics',
    ]);
  if (tab === 'certificates')
    return renderSimpleList('Certificates', 'Your completed milestones.', [
      'JavaScript Foundations',
      'HTML + CSS Basics',
      'Git Essentials',
    ]);
  if (tab === 'settings')
    return renderSimpleList('Settings', 'Tune your StudyFlow experience.', [
      'Notifications',
      'Playback preferences',
      'Appearance',
      'Account',
    ]);

  return renderDashboard();
}
