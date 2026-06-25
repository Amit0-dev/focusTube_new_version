import { cn } from "@/lib/cn";
import { Mail } from "lucide-react";
import DashboardCard from "../learner-dashboard/DashboardCard";
import { getJoinedUsersOfCreatorPlaylistService } from "@/server/services/creator.service";
import { PlaylistStatus } from "@/generated/prisma/enums";
import { AppError } from "@/lib/errors/appError";


interface User {
    progress: {
        playlistId: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        completedVideosCount: number;
        status: PlaylistStatus;
        completedAt: Date | null;
    } | null;
    User: {
        id: string;
        name: string;
        email: string;
    };
    playlistId: string;
    id: string;
    userId: string;
    ownedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export async function UsersTab({ playlistId }: { playlistId: string }) {

    let users: User[] = []
    let errorMessage: string | null = null;

    try {
        users = await getJoinedUsersOfCreatorPlaylistService(playlistId)
    } catch (error) {
        errorMessage = error instanceof AppError ? error.message : "Failed to fetch creator playlists"
    }

    if (errorMessage) {
        return (
            <DashboardCard className="border border-red-500/20 bg-red-500/10 p-6">
                <div className="text-sm font-semibold text-red-100">
                    Could not get users
                </div>
                <div className="mt-1 text-sm text-red-100/70">{errorMessage}</div>
                {/* add a retry button here in case of error in future  */}
            </DashboardCard>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            {/* Users toolbar */}
            <div className="flex items-center justify-between">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80">
                    {users.length} Members
                </span>

            </div>

            {/* Users list */}
            <div className="space-y-2">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition hover:border-white/10 hover:bg-white/[0.04]"
                    >
                        {/* Avatar */}
                        <div
                            className={cn(
                                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white ring-1 ring-white/10',
                            )}
                        >
                            {user?.User?.name[0]?.toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white">{user.User.name}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                                <Mail size={11} />
                                <span className="truncate">{user.User.email}</span>
                            </div>
                        </div>

                        {/* Status & Progress */}
                        <div className="hidden items-center gap-3 sm:flex">
                            {/* Completed videos count */}
                            <div className="flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 shadow-sm shadow-cyan-500/5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                <span className="text-sm font-bold tabular-nums text-cyan-300">
                                    {user.progress?.completedVideosCount ?? 0}
                                </span>
                                <span className="text-[10px] font-medium tracking-wide text-white/35">completed</span>
                            </div>

                            {/* Status badge */}
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                                    user.progress?.status === 'COMPLETED'
                                        ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                                        : user.progress?.status === 'IN_PROGRESS'
                                            ? 'border border-amber-400/20 bg-amber-400/10 text-amber-300'
                                            : 'border border-white/10 bg-white/5 text-white/50',
                                )}
                            >
                                <span
                                    className={cn(
                                        'h-1.5 w-1.5 rounded-full',
                                        user.progress?.status === 'COMPLETED'
                                            ? 'bg-emerald-400'
                                            : user.progress?.status === 'IN_PROGRESS'
                                                ? 'bg-amber-400'
                                                : 'bg-white/40',
                                    )}
                                />
                                {user.progress?.status === 'COMPLETED'
                                    ? 'Completed'
                                    : user.progress?.status === 'IN_PROGRESS'
                                        ? 'In Progress'
                                        : 'New'}
                            </span>
                        </div>

                        {/* Completed date — only shown for completed users */}
                        {user.progress?.status === 'COMPLETED' && user.progress.completedAt && (
                            <div className="hidden text-center lg:block">
                                <div className="text-[11px] text-emerald-400/50">Completed on</div>
                                <div className="text-xs font-medium text-emerald-300/70">
                                    {new Date(user.progress.completedAt).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                        {/* Joined date */}
                        <div className="hidden text-right lg:block">
                            <div className="text-[11px] text-white/30">Joined</div>
                            <div className="text-xs text-white/50">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
