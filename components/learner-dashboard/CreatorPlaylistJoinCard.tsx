"use client"

import { useState } from "react";
import DashboardCard from "./DashboardCard";
import { apiFetch } from "@/lib/api/apiFetch";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

type CreatorPlaylistJoinCardProps = {
    playlist: {
        id: string;
        title: string;
        channelTitle: string;
        thumbnail: string | null;
        itemCount: number;
    };
};

export default function CreatorPlaylistJoinCard({
    playlist,
}: CreatorPlaylistJoinCardProps) {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    async function joinPlaylist() {
        try {
            setLoading(true)
            setError(null)
            const response: any = await apiFetch(
                `/api/creator/playlist/join`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        playlistId: playlist.id,
                    }),
                },
            );
            console.log('join playlist response:', response);

            router.push("/learner/?tab=playlists")

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to join playlist');
        } finally {
            setLoading(false);
        }
    }

    if (error) {

        return (
            <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
                <div className="text-sm font-semibold text-red-100">
                    Could not load creator playlist
                </div>
                <div className="mt-1 text-sm text-red-100/70">{error}</div>
                {/* add a retry button here in case of error in future  */}
            </DashboardCard>
        );

    }

    return (
        <DashboardCard
            key={playlist.id}
            className="group relative flex h-full flex-col overflow-hidden border-white/10 bg-linear-to-br from-white/8 via-white/5 to-white/3 p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-400/20 hover:bg-white/8"
        >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 ring-1 ring-white/5">
                {playlist.thumbnail ? (
                    <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="h-full w-full object-cover opacity-95 transition-transform duration-300 scale-[0.98] group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="h-full w-full bg-linear-to-br from-orange-500/20 to-amber-400/10" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-black/0" />

                <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
                    {playlist.itemCount} videos
                </div>
            </div>

            <div className="relative mt-4 flex flex-1 flex-col gap-4">
                <div className="min-w-0">
                    <div className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-[1.05rem]">
                        {playlist.title}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
                        <span className="truncate">{playlist.channelTitle}</span>
                        <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:inline-flex" />
                        <span className="text-white/45">Learning playlist</span>
                    </div>
                </div>
                <button
                    onClick={() => joinPlaylist()}
                    type="button"
                    disabled={loading}
                    suppressHydrationWarning
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:opacity-95 sm:w-auto"
                >
                    {loading ? <div className="flex items-center gap-2 justify-center">
                        <Spinner color="current" size="sm" />
                        <p>Joining...</p>
                    </div> : 'Join Now'}
                </button>
            </div>

        </DashboardCard>
    )
}