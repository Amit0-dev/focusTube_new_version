'use client';

import { useEffect, useState } from 'react';

import PlaylistDetailSidebar from '@/components/creator-playlist/PlaylistDetailSidebar';
import PlaylistDetailTopNav from '@/components/creator-playlist/PlaylistDetailTopNav';
import { cn } from '@/lib/cn';

export default function PlaylistDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarHidden, setDesktopSidebarHidden] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <PlaylistDetailSidebar
        mobileOpen={mobileSidebarOpen}
        desktopHidden={desktopSidebarHidden}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          'flex h-full min-w-0 flex-col transition-[padding-left] duration-300 ease-out',
          desktopSidebarHidden ? 'md:pl-0' : 'md:pl-72',
        )}
      >
        <PlaylistDetailTopNav
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleDesktopSidebar={() =>
            setDesktopSidebarHidden((prev) => !prev)
          }
          desktopSidebarHidden={desktopSidebarHidden}
        />

        <div className="scrollbar-hide flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
