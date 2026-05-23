import DashboardCard from './DashboardCard';
import SectionHeader from './SectionHeader';

export default function Note({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} />

      <DashboardCard className="p-6">
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="text-sm font-medium text-white">{it}</div>
              <button
                type="button"
                suppressHydrationWarning
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
