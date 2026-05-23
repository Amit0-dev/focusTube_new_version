'use client';

import { Show, UserButton } from '@clerk/nextjs';
import { Bell, ChevronLeft, ChevronRight, Menu, Search } from 'lucide-react';

import { cn } from '@/lib/cn';

export default function TopNav({
  onOpenMobileSidebar,
  onToggleDesktopSidebar,
  desktopSidebarHidden,
}: {
  onOpenMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
  desktopSidebarHidden: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          suppressHydrationWarning
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          suppressHydrationWarning
          className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 md:inline-flex"
          aria-label={desktopSidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
          title={desktopSidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
        >
          {desktopSidebarHidden ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        <div className="flex flex-1 items-center justify-end gap-3">
          {/* <div className="relative w-full max-w-xl">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            />
            <input
              suppressHydrationWarning
              placeholder="Search courses, playlists, notes..."
              className={cn(
                'h-10 w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/40',
                'focus:outline-none focus:ring-2 focus:ring-orange-500/30',
              )}
            />
          </div> */}

          {/* <button
            type="button"
            suppressHydrationWarning
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button> */}

          <Show when="signed-in">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 hover:bg-white/10">
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" aria-label="User" />
          </Show>
        </div>
      </div>
    </div>
  );
}
