export function ProgressBar({ value }: { value: number }) {
    return (
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
            <div
                className="h-full rounded-full bg-linear-to-r from-cyan-400 to-cyan-300 transition-all duration-500"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}