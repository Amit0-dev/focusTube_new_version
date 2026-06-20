import { BarChart3, GripVertical, MoreHorizontal, Pencil } from "lucide-react";
import { VideoThumbnail } from "./VideoThumbnail";
import { PlaylistVideoType } from "@/types/playlist";
import { getVideosByPlaylistIdService } from "@/server/services/video.service";
import DashboardCard from "../learner-dashboard/DashboardCard";

export async function VideosTab({
    playlistId
}: {
    playlistId: string
}) {

    let vidoes: PlaylistVideoType[] = []
    let errorMessage: string | null = null;

    try {
        vidoes = await getVideosByPlaylistIdService(playlistId)
    } catch (error) {
        console.error('Failed to fetch videos:', error);
        errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch videos';
    }

    if (errorMessage) {
        return (
            <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
                <div className="text-sm font-semibold text-red-100">
                    Could not load videos
                </div>
                <div className="mt-1 text-sm text-red-100/70">{errorMessage}</div>
                {/* add a retry button here in case of error in future  */}
            </DashboardCard>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            {vidoes.map((video) => (
                <div
                    key={video.id}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                    <GripVertical
                        size={16}
                        className="flex-shrink-0 cursor-grab text-white/20 transition group-hover:text-white/40"
                    />
                    <VideoThumbnail image={video.thumbnail} />
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">
                            {video.position}. {video.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/40">
                            <span>{new Date(video.publishedAt).toLocaleString()}</span>

                        </div>
                    </div>
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                        >
                            <BarChart3 size={14} />
                        </button>
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                        >
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}