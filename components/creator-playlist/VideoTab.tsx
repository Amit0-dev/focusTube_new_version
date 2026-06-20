import { BarChart3, GripVertical, MoreHorizontal, Pencil } from "lucide-react";
import { VideoThumbnail } from "./VideoThumbnail";

export function VideosTab() {

    const VIDEOS = [
        {
            id: '1',
            number: '01',
            title: "Why RAG is Dead (And What's Next)",
            date: 'May 20, 2026',
            views: '1.2K views',
            learners: 254,
            status: 'Published',
            duration: '12:34',
            color: 'from-red-600/80 to-orange-500/60',
        },
        {
            id: '2',
            number: '02',
            title: 'The Problem with Traditional RAG',
            date: 'May 18, 2026',
            views: '980 views',
            learners: 210,
            status: 'Published',
            duration: '15:48',
            color: 'from-purple-600/80 to-pink-500/60',
        },
        {
            id: '3',
            number: '03',
            title: 'Understanding Context Window Limits',
            date: 'May 16, 2026',
            views: '870 views',
            learners: 189,
            status: 'Published',
            duration: '18:22',
            color: 'from-emerald-600/80 to-teal-500/60',
        },
        {
            id: '4',
            number: '04',
            title: 'Introducing the DEAD Framework',
            date: 'May 14, 2026',
            views: '1.1K views',
            learners: 230,
            status: 'Published',
            duration: '14:10',
            color: 'from-amber-600/80 to-yellow-500/60',
        },
        {
            id: '5',
            number: '05',
            title: 'Building Smarter Data Pipelines',
            date: 'May 12, 2026',
            views: '750 views',
            learners: 172,
            status: 'Published',
            duration: '16:05',
            color: 'from-sky-600/80 to-blue-500/60',
        },
    ];

    return (
        <div className="mt-4 space-y-2">
            {VIDEOS.map((video) => (
                <div
                    key={video.id}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                    <GripVertical
                        size={16}
                        className="flex-shrink-0 cursor-grab text-white/20 transition group-hover:text-white/40"
                    />
                    <VideoThumbnail color={video.color} duration={video.duration} />
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">
                            {video.number}. {video.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-white/40">
                            <span>{video.date}</span>
                            <span className="h-1 w-1 rounded-full bg-white/20" />
                            <span>{video.views}</span>
                            <span className="h-1 w-1 rounded-full bg-white/20" />
                            <span>{video.learners} learners</span>
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