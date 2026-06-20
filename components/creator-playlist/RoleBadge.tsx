import { cn } from "@/lib/cn";
import { Crown, Shield, Users } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, { bg: string; text: string; icon: typeof Crown }> = {
        Creator: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', icon: Crown },
        Editor: { bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-400', icon: Shield },
        Learner: { bg: 'bg-white/5 border-white/10', text: 'text-white/60', icon: Users },
    };

    const style = styles[role] ?? styles.Learner;
    const Icon = style.icon;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                style.bg,
                style.text,
            )}
        >
            <Icon size={11} />
            {role}
        </span>
    );
}