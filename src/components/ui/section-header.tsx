interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-8 w-1 bg-blue-500/30 rounded-full" />
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
}
