import { cn } from "@/lib/cn";
import { Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { RoleBadge } from "./RoleBadge";
import { getJoinedUsersOfCreatorPlaylist } from "@/server/dal/prisma/playlist.dal";
import DashboardCard from "../learner-dashboard/DashboardCard";

type Role = "LEARNER" | "ADMIN" | "CREATOR";

interface User {
    User: {
        id: string;
        name: string;
        email: string;
        role: Role;
    };
    playlistId: string;
    id: string;
    userId: string;
    ownedBy: string | null;
    createdAt: Date;
    updatedAt: Date
}

export async function UsersTab({ playlistId }: { playlistId: string }) {

    let users: User[] = []
    let errorMessage: string | null = null;

    try {
        users = await getJoinedUsersOfCreatorPlaylist(playlistId)
    } catch (error) {
        console.error('Failed to get users:', error);
        errorMessage =
            error instanceof Error ? error.message : 'Failed to get users';
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
                            {user.User.name}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white">{user.User.name}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                                <Mail size={11} />
                                <span className="truncate">{user.User.email}</span>
                            </div>
                        </div>

                        {/* Progress */}
                        {/* <div className="hidden items-center gap-2 sm:flex">
                            <ProgressBar value={user.progress} />
                            <span className="text-xs font-medium text-white/50">{user.progress}%</span>
                        </div> */}

                        {/* Role */}
                        <RoleBadge role={user.User.role} />

                        {/* Joined date */}
                        <div className="hidden text-right lg:block">
                            <div className="text-[11px] text-white/30">Joined</div>
                            <div className="text-xs text-white/50">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>

                        {/* Actions */}
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                        >
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
