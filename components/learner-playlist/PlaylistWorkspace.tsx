'use client';

import DashboardCard from '@/components/learner-dashboard/DashboardCard';
import SectionHeader from '@/components/learner-dashboard/SectionHeader';
import { apiFetch } from '@/lib/api/apiFetch';
import { Clock3, NotebookPen, PlayCircle, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { YouTubePlayer } from 'react-youtube';

import Player from './Player';

type PlaylistSummary = {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  itemCount: number;
};

type PlaylistVideo = {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  position: number;
  description: string | null;
  isComplete: boolean;
  completedAt: Date | null;
};

type NoteEntry = {
  videoId: string;
  playlistId: string;
  id: string;
  content: string;
  timestamp: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

function formatClock(date: Date) {
  if (!date) {
    return;
  }

  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PlaylistWorkspace({
  videos,
  playlist,
}: {
  playlist: PlaylistSummary;
  videos: PlaylistVideo[];
}) {
  const [activeVideoId, setActiveVideoId] = useState<string>(
    videos[0]?.youtubeVideoId ?? '',
  );
  const [noteDraft, setNoteDraft] = useState('');
  const [allNotesOpen, setAllNotesOpen] = useState(false);
  const [notesByVideo, setNotesByVideo] = useState<NoteEntry[]>([]);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false);
  const [creatingNote, setCreatingNote] = useState<boolean>(false);

  // Perhaps add zustand to add global state management
  const currentTimeRef = useRef<number>(0);

  const handleTimeUpdate = (time: number) => {
    currentTimeRef.current = time;
  };

  const playerRef = useRef<YouTubePlayer>(null);

  const handlePlayerRef = (player: YouTubePlayer) => {
    playerRef.current = player;
  };

  const activeVideo = useMemo(
    () =>
      videos.find((video) => video.youtubeVideoId === activeVideoId) ??
      videos[0],
    [activeVideoId, videos],
  );

  const notesPreview = notesByVideo.slice(0, 3);

  const focusScore = Math.min(100, 28 + notesByVideo.length * 18);

  async function createNote() {
    try {
      setCreatingNote(true);
      if (!noteDraft.trim() || !activeVideo) return;

      const payload = {
        videoId: activeVideo.id,
        playlistId: playlist.id,
        content: noteDraft.trim(),
        timestamp: currentTimeRef.current,
      };

      const response = await apiFetch('/api/note', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response) {
        throw new Error('Failed to save note');
      }

      setNoteDraft('');

      // call get notes api and update the note list
      getNotesByVideoId(activeVideo.id);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setCreatingNote(false);
    }
  }

  async function getNotesByVideoId(videoId: string) {
    try {
      setLoadingNotes(true);
      const response: any = await apiFetch(
        `/api/note?videoId=${videoId}&playlistId=${playlist.id}`,
        {
          method: 'GET',
        },
      );

      if (!response) {
        throw new Error('Failed to fetch notes');
      }

      console.log('fetched notes response: ', response);
      setNotesByVideo(response.notes);
      console.log('fetched notes: ', response.notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  }

  useEffect(() => {
    if (activeVideo) {
      getNotesByVideoId(activeVideo.id);
    }
  }, [activeVideo]);

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-20 h-52 w-52 rounded-full bg-orange-500/10 blur-[96px]" />
      <div className="pointer-events-none absolute top-10 right-6 h-44 w-44 rounded-full bg-cyan-400/9 blur-[88px]" />

      <SectionHeader
        title={playlist.title}
        subtitle="Watch, take notes, and move through your playlist with focus."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="order-1 lg:col-span-8">
          <DashboardCard className="overflow-hidden border-white/15 bg-linear-to-br from-slate-900/90 via-slate-900/70 to-slate-950/80 p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                <PlayCircle size={14} className="text-orange-300" />
                Focus Player
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  {videos.length} in queue
                </span>
                <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Focus {focusScore}%
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50 ring-1 ring-orange-300/20">
              <Player
                videoId={activeVideo.id}
                videoIdYt={activeVideo.youtubeVideoId}
                videoTitle={activeVideo?.title}
                playlistId={playlist.id}
                handleTimeUpdate={handleTimeUpdate}
                handlePlayerRef={handlePlayerRef}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-white sm:text-xl">
                  {activeVideo?.title ?? 'No video selected'}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  {activeVideo?.channelTitle ?? playlist.channelTitle}
                </p>
              </div>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left sm:w-auto sm:text-right">
                <div className="text-[11px] uppercase tracking-wide text-white/50">
                  Current position
                </div>
                <div className="text-sm font-semibold text-white/85">
                  {(activeVideo?.position ?? 0) + 1} / {videos.length}
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="order-3 lg:col-span-8">
          <DashboardCard className="border-white/15 bg-linear-to-br from-slate-900/80 to-slate-950/70 p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Video Queue</h3>
              <span className="text-xs text-white/60">
                Tap to switch context
              </span>
            </div>

            {videos.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/70">
                No videos found in this playlist.
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video, index) => {
                  const isActive =
                    activeVideo?.youtubeVideoId === video.youtubeVideoId;
                  const isCompleted = video.isComplete;

                  return (
                    <button
                      key={video.youtubeVideoId}
                      type="button"
                      onClick={() => setActiveVideoId(video.youtubeVideoId)}
                      className={`group flex w-full items-center gap-2.5 rounded-2xl border px-2.5 py-2.5 text-left transition sm:gap-3 sm:px-3 sm:py-3 ${
                        isCompleted
                          ? isActive
                            ? 'border-emerald-300/45 bg-linear-to-r from-emerald-500/18 via-emerald-400/12 to-teal-300/10 shadow-lg shadow-emerald-500/10'
                            : 'border-emerald-400/25 bg-linear-to-r from-emerald-500/12 via-emerald-400/8 to-teal-300/6 hover:border-emerald-300/40 hover:bg-emerald-400/12'
                          : isActive
                            ? 'border-orange-300/40 bg-linear-to-r from-orange-500/15 to-amber-300/10 shadow-lg shadow-orange-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isCompleted
                            ? 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/25'
                            : 'text-white/50'
                        }`}
                      >
                        {video.position + 1}
                      </div>

                      <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30 sm:h-14 sm:w-24">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-full w-full bg-linear-to-br from-orange-500/20 to-amber-400/10" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold ${isCompleted ? 'text-emerald-50' : 'text-white'}`}
                        >
                          {video.title}
                        </p>
                        <p
                          className={`mt-1 truncate text-xs ${isCompleted ? 'text-emerald-100/65' : 'text-white/60'}`}
                        >
                          {video.channelTitle}
                        </p>
                      </div>

                      <div className="hidden items-center gap-2 sm:flex">
                        {isCompleted ? (
                          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                            Completed
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="order-2 lg:col-span-4">
          <DashboardCard className="flex flex-col border-white/15 bg-linear-to-b from-slate-900/95 to-slate-950/95 p-4 md:p-5 lg:sticky lg:top-24 lg:h-[calc(100dvh-8.5rem)]">
            <div className="flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                <NotebookPen size={14} className="text-cyan-300" />
                Study Notes
              </h3>
              <button
                type="button"
                onClick={() => setAllNotesOpen(true)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/75 transition hover:bg-white/10"
              >
                All Notes ({notesByVideo.length})
              </button>
            </div>

            <p className="mt-2 text-xs text-white/60">
              Write a short note while watching, then click Save.
            </p>

            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              onKeyDown={async (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  await createNote();
                }
              }}
              placeholder="Write your note here..."
              className="mt-4 h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-cyan-300/40"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={createNote}
                disabled={creatingNote}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 cursor-pointer"
              >
                {creatingNote ? 'Saving...' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={() => setNoteDraft('')}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                Clear
              </button>
            </div>

            <div className="mt-2 text-[11px] text-white/50">
              Tip: press Ctrl+Enter to save quickly.
            </div>

            <div className="relative mt-4 max-h-52 sm:max-h-64 lg:min-h-0 lg:max-h-64">
              <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-6 bg-linear-to-b from-slate-900/95 to-transparent" />
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-6 bg-linear-to-t from-slate-950/95 to-transparent" />

              <div className="scrollbar-hide h-full space-y-3 overflow-y-auto py-2 pr-1">
                {notesPreview.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-xs text-white/60">
                    No notes for this video yet. Capture your first insight.
                  </div>
                ) : (
                  notesPreview.map((note) => (
                    <div
                      key={note.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/8 to-white/3 px-3 py-3"
                    >
                      <div className="absolute top-0 left-0 h-full w-1.5 bg-linear-to-b from-cyan-400/70 to-blue-500/70" />

                      <div className="mb-2 flex items-center justify-between gap-2 pl-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                            Note
                          </span>
                          <span
                            onClick={() => {
                              if (playerRef.current) {
                                playerRef.current.seekTo(note.timestamp, true);
                              }
                            }}
                            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-white/60 cursor-pointer"
                          >
                            Jump
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1 text-[10px] text-white/50">
                          <Clock3 size={11} />
                          {formatClock(note.createdAt)}
                        </div>
                      </div>

                      <div className="pl-2 text-xs leading-relaxed text-white/85">
                        {note.content}
                      </div>

                      <div className="mt-2 flex items-center justify-end pl-2">
                        <button
                          type="button"
                          onClick={() => {
                            alert('Delete note functionality coming soon!');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white/70 opacity-80 transition hover:bg-white/10 hover:opacity-100"
                        >
                          <Trash2 size={11} />
                          remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {notesByVideo.length > 3 ? (
              <button
                type="button"
                onClick={() => setAllNotesOpen(true)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                View all {notesByVideo.length} notes
              </button>
            ) : null}
          </DashboardCard>
        </div>
      </div>

      {allNotesOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close notes panel"
            onClick={() => setAllNotesOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="absolute top-0 right-0 h-full w-full max-w-xl border-l border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/60 md:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">All Notes</h4>
              <button
                type="button"
                onClick={() => setAllNotesOpen(false)}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mt-1 text-xs text-white/60">
              {activeVideo?.title ?? 'Selected video'}
            </p>

            <div className="scrollbar-hide mt-4 h-[calc(100dvh-7.5rem)] space-y-3 overflow-y-auto pr-1">
              {notesByVideo.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-xs text-white/60">
                  No notes yet for this video.
                </div>
              ) : (
                notesByVideo.map((note) => (
                  <div
                    key={note.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/8 to-white/3 px-3 py-3"
                  >
                    <div className="absolute top-0 left-0 h-full w-1.5 bg-linear-to-b from-cyan-400/70 to-blue-500/70" />

                    <div className="mb-2 flex items-center justify-between gap-2 pl-2">
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                        Note
                      </span>
                      <div className="inline-flex items-center gap-1 text-[10px] text-white/50">
                        <Clock3 size={11} />
                        {formatClock(note.createdAt)}
                      </div>
                    </div>

                    <div className="pl-2 text-xs leading-relaxed text-white/85">
                      {note.content}
                    </div>

                    <div className="mt-2 flex items-center justify-end pl-2">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white/70 opacity-80 transition hover:bg-white/10 hover:opacity-100"
                      >
                        <Trash2 size={11} />
                        remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
