export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  );
}
