import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <article className={cn("kpi-float stagger-in p-5 md:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted text-[11px] font-medium tracking-[0.16em] uppercase">
          {label}
        </p>
        <span className="text-accent/80 flex size-9 items-center justify-center rounded-xl bg-accent-soft">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      </div>
      <p className="text-accent mt-4 font-display text-[1.85rem] leading-none font-semibold tracking-tight tabular-nums md:text-[2.15rem]">
        {value}
      </p>
      {hint ? <p className="text-muted mt-3 text-xs leading-relaxed">{hint}</p> : null}
    </article>
  );
}
