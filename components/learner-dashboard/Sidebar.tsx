'use client';

import { cn } from '@/lib/cn';
import {
  Award,
  BookMarked,
  Bookmark,
  LayoutDashboard,
  ListVideo,
  Settings,
  StickyNote,
  TrendingUp,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const navItems = [
  { label: 'Playlists', tab: 'playlists', Icon: ListVideo },
  { label: 'Notes', tab: 'notes', Icon: StickyNote },
  { label: 'Creator Playlists', tab: 'creator-playlists', Icon: ListVideo },
  { label: 'Dashboard', tab: 'dashboard', Icon: LayoutDashboard },
] as const;

export default function Sidebar({
  mobileOpen,
  desktopHidden,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  desktopHidden: boolean;
  onCloseMobile: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'playlists';

  function goToTab(nextTab: string) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set('tab', nextTab);

    const url = `/learner?${nextSearchParams.toString()}`;
    router.replace(url);
    onCloseMobile();
  }

  return (
    <aside
      className={cn(
        'scrollbar-hide fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-white/10 bg-linear-to-b from-slate-950/80 to-slate-900/60 px-4 py-5 backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out will-change-transform',
        mobileOpen
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0',
        desktopHidden
          ? 'md:-translate-x-full md:opacity-0 md:pointer-events-none'
          : 'md:translate-x-0 md:opacity-100',
      )}
      aria-label="Learner sidebar"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goToTab('playlists')}
            className="h-10 w-10 rounded-2xl bg-linear-to-br from-orange-500/30 to-amber-400/20 ring-1 ring-white/10"
            aria-label="Go to Playlists"
          />
          <div className="leading-tight">
            <div className="text-lg font-semibold text-white">StudyFlow</div>
            <div className="text-xs text-white/50">Learner</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          suppressHydrationWarning
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Close sidebar"
        >
          Close
        </button>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map(({ label, tab: itemTab, Icon }) => {
          const isActive = tab === itemTab;

          return (
            <button
              key={itemTab}
              type="button"
              onClick={() => goToTab(itemTab)}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-white/10 text-white ring-1 ring-white/10'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'opacity-80 transition group-hover:opacity-100',
                  isActive && 'text-orange-300 opacity-100',
                )}
              />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">Quick tip</div>
        <div className="mt-1 text-xs text-white/60">
          Keep your streak alive by finishing one video today.
        </div>
      </div>

      <div className="mt-8 text-xs text-white/40">
        © {new Date().getFullYear()} StudyFlow
      </div>
    </aside>
  );
}
