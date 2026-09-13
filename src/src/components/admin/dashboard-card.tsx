import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number;
  subtitle: string;
  href: string;
  icon: LucideIcon;

  bgColor: string;
  iconColor: string;
  numberColor: string;
}

export default function DashboardCard({
  title,
  count,
  subtitle,
  href,
  icon: Icon,
  bgColor,
  iconColor,
  numberColor,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        bg-white
        p-8
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${bgColor}
          `}
        >
          <Icon
            className={`
              h-8
              w-8
              ${iconColor}
            `}
          />
        </div>

        <ArrowRight
          className="
            text-slate-400
            transition-transform
            group-hover:translate-x-1
          "
        />
      </div>

      <h2 className="mt-8 text-2xl font-bold">
        {title}
      </h2>

      <p
        className={`
          mt-2
          text-5xl
          font-black
          ${numberColor}
        `}
      >
        {count}
      </p>

      <p className="mt-1 text-slate-500">
        {subtitle}
      </p>
    </Link>
  );
}