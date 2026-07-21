interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <span className="rounded-full border px-4 py-2 text-sm font-medium">
        {badge}
      </span>

      <h2 className="mt-6 text-4xl font-bold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}