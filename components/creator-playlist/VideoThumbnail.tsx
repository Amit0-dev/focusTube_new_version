import { cn } from "@/lib/cn";

export function VideoThumbnail({ color, duration }: { color: string; duration: string }) {
    return (
        <div
            className={cn(
                'relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-linear-to-br',
                color,
            )}
        >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
            <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {duration}
            </div>
        </div>
    );
}