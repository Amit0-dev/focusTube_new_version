import { cn } from "@/lib/cn";
import { Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { RoleBadge } from "./RoleBadge";

export function UsersTab() {

    const USERS = [
        {
            id: '1',
            name: 'Jahid Hasan',
            email: 'jahid@example.com',
            role: 'Learner',
            joinedAt: 'May 18, 2026',
            progress: 60,
            avatar: 'J',
            avatarColor: 'from-emerald-500/40 to-teal-500/30',
        },
        {
            id: '2',
            name: 'Sarah Chen',
            email: 'sarah@example.com',
            role: 'Editor',
            joinedAt: 'May 10, 2026',
            progress: 85,
            avatar: 'S',
            avatarColor: 'from-pink-500/40 to-rose-500/30',
        },
        {
            id: '3',
            name: 'Alex Rivera',
            email: 'alex@example.com',
            role: 'Learner',
            joinedAt: 'May 15, 2026',
            progress: 40,
            avatar: 'A',
            avatarColor: 'from-sky-500/40 to-blue-500/30',
        },
        {
            id: '4',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            role: 'Learner',
            joinedAt: 'May 12, 2026',
            progress: 90,
            avatar: 'P',
            avatarColor: 'from-violet-500/40 to-purple-500/30',
        },
        {
            id: '5',
            name: 'Noyon Ahmed',
            email: 'noyon@example.com',
            role: 'Creator',
            joinedAt: 'May 5, 2026',
            progress: 100,
            avatar: 'N',
            avatarColor: 'from-indigo-500/40 to-purple-500/30',
        },
    ];

    return (
        <div className="mt-4 space-y-3">
            {/* Users toolbar */}
            <div className="flex items-center justify-between">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80">
                    {USERS.length} Members
                </span>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                    <UserPlus size={15} />
                    Invite user
                </button>
            </div>

            {/* Users list */}
            <div className="space-y-2">
                {USERS.map((user) => (
                    <div
                        key={user.id}
                        className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition hover:border-white/10 hover:bg-white/[0.04]"
                    >
                        {/* Avatar */}
                        <div
                            className={cn(
                                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white ring-1 ring-white/10',
                                user.avatarColor,
                            )}
                        >
                            {user.avatar}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                                <Mail size={11} />
                                <span className="truncate">{user.email}</span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="hidden items-center gap-2 sm:flex">
                            <ProgressBar value={user.progress} />
                            <span className="text-xs font-medium text-white/50">{user.progress}%</span>
                        </div>

                        {/* Role */}
                        <RoleBadge role={user.role} />

                        {/* Joined date */}
                        <div className="hidden text-right lg:block">
                            <div className="text-[11px] text-white/30">Joined</div>
                            <div className="text-xs text-white/50">{user.joinedAt}</div>
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
