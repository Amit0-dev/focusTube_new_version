'use client';

import { cn } from '@/lib/cn';
import {
  ClipboardList,
  Users,
  Video,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const manageItems = [
  { label: 'Videos', tab: 'videos', icon: Video },
  { label: 'Users', tab: 'users', icon: Users },
  { label: 'Assignments', tab: 'assignments', icon: ClipboardList },
] as const;

export default function PlaylistDetailSidebar({
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
  const tab = searchParams.get('tab') ?? 'videos';

  function goToTab(nextTab: string) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set('tab', nextTab);

    router.replace(`?${nextSearchParams.toString()}`);
    onCloseMobile();
  }

  return (
    <aside
      className={cn(
        'scrollbar-hide fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-white/10 bg-linear-to-b from-slate-950/80 to-slate-900/60 px-4 py-5 backdrop-blur-xl transition-[transform,opacity] duration-300 ease-out will-change-transform',
        mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
        desktopHidden
          ? 'md:-translate-x-full md:opacity-0 md:pointer-events-none'
          : 'md:translate-x-0 md:opacity-100',
      )}
      aria-label="Playlist detail sidebar"
    >
      {/* Header — logo + close on mobile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-cyan-500/30 to-sky-400/20 ring-1 ring-white/10" />
          <div className="leading-tight">
            <div className="text-lg font-semibold text-white">FocusTube</div>
            <div className="text-xs text-white/50">Creator Studio</div>
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

      {/* MANAGE section */}
      <div className="mt-8">
        <div className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Manage
        </div>
        <nav className="space-y-1">
          {manageItems.map(({ label, tab: itemTab, icon: Icon }) => {
            const isActive = tab === itemTab;

            return (
              <button
                key={itemTab}
                type="button"
                onClick={() => goToTab(itemTab)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition',
                  isActive
                    ? 'bg-white/10 text-white ring-1 ring-white/10'
                    : 'text-white/70 hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    'opacity-80 transition group-hover:opacity-100',
                    isActive && 'text-cyan-300 opacity-100',
                  )}
                />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Copyright */}
      <div className="mt-8 text-xs text-white/40">
        © {new Date().getFullYear()} FocusTube
      </div>
    </aside>
  );
}
