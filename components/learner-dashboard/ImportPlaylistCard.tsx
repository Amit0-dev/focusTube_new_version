'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Import,
  Link as LinkIcon,
  Loader2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

function isLikelyYouTubePlaylistUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+[?&]list=([a-zA-Z0-9_-]+)/.test(
    trimmed,
  );
}

// TODO: add better error handling and proper error message show on frontend

export default function ImportPlaylistCard() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');

  type ImportStatus = 'idle' | 'importing' | 'success' | 'error';
  const [status, setStatus] = useState<ImportStatus>('idle');

  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const canImport = isLikelyYouTubePlaylistUrl(playlistUrl);

  const canShowStatus = status !== 'idle';

  const statusLabel = useMemo(() => {
    if (status === 'importing') return 'Importing…';
    if (status === 'success') return 'Imported';
    if (status === 'error') return 'Import failed';
    return '';
  }, [status]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    if (!isOpen) return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (status !== 'success') return;

    const t = window.setTimeout(() => {
      setStatus('idle');
    }, 2500);

    return () => window.clearTimeout(t);
  }, [status]);

  async function onImport() {
    if (!canImport) {
      setImportError(
        'Paste a valid YouTube playlist link (it should contain “list=...”).',
      );
      return;
    }

    setIsOpen(false);
    setStatus('importing');

    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const res = await fetch('/api/playlist/import-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl: playlistUrl.trim() }),
      });

      const data = await res.json();

      console.log('Import response:', { res, data });

      if (!res.ok) {
        setImportError(data?.error ?? 'Failed to import playlist.');
        setStatus('error');
        return;
      }

      setImportSuccess('Playlist imported.');
      setPlaylistUrl('');
      setStatus('success');
      router.refresh();
    } catch {
      setImportError('Failed to import playlist.');
      setStatus('error');
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={importLoading}
        onClick={() => {
          setIsOpen(true);
          setImportError(null);
          setImportSuccess(null);
        }}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/90 transition hover:bg-white/7"
      >
        <Import size={16} className="text-orange-300" />
        Import playlist
      </button>

      {canShowStatus && (
        <div
          className={
            status === 'importing'
              ? 'inline-flex h-9 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs text-white/70'
              : status === 'success'
                ? 'inline-flex h-9 items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs text-emerald-200'
                : 'inline-flex h-9 items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-3 text-xs text-red-200'
          }
        >
          {status === 'importing' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          <span>{statusLabel}</span>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-xl backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/15 via-amber-400/10 to-slate-900/10" />

            <div className="relative p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Import a playlist
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Paste a YouTube playlist URL to add it to your learning
                    queue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/7"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="relative">
                  <LinkIcon
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    value={playlistUrl}
                    onChange={(e) => {
                      setPlaylistUrl(e.target.value);
                      if (importError) setImportError(null);
                      if (importSuccess) setImportSuccess(null);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white/90 outline-none transition placeholder:text-white/35 focus:border-orange-400/40 focus:bg-white/7"
                    autoFocus
                  />
                </div>

                {!!playlistUrl.trim() && (
                  <div className="text-xs text-white/50 wrap-break-word">
                    {playlistUrl.trim()}
                  </div>
                )}

                {!!playlistUrl.trim() && !canImport && (
                  <div className="text-xs text-amber-200/90">
                    Paste a valid YouTube playlist link (it should contain
                    “list=...”).
                  </div>
                )}

                {importError && (
                  <div className="text-xs text-red-200/90">{importError}</div>
                )}
                {importSuccess && (
                  <div className="text-xs text-emerald-200/90">
                    {importSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={importLoading}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 transition hover:bg-white/7 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={onImport}
                    disabled={importLoading || !canImport}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {importLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Importing
                      </>
                    ) : (
                      <>
                        Import
                        <ArrowRight size={16} className="opacity-80" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
