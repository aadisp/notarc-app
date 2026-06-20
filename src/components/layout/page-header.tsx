interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="mb-4 text-5xl font-bold">
        {title}
      </h1>

      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}