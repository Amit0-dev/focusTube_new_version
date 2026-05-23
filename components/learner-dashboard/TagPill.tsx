export default function TagPill({
  tag,
}: {
  tag: 'New' | 'Popular' | 'In Progress';
}) {
  const styles =
    tag === 'New'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
      : tag === 'Popular'
        ? 'border-orange-400/20 bg-orange-400/10 text-orange-200'
        : 'border-amber-400/20 bg-amber-400/10 text-amber-200';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {tag}
    </span>
  );
}
