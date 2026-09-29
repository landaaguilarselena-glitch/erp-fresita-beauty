import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function InsightCard({
  icon: Icon,
  kicker,
  children,
  tone = "brand",
}: {
  icon: LucideIcon;
  kicker: string;
  children: string;
  tone?: "brand" | "alert" | "healthy";
}) {
  return (
    <aside
      className={cn(
        "insight-premium stagger-in flex items-start gap-4 px-5 py-5 md:px-7 md:py-6",
        tone === "alert" && "alert",
        tone === "healthy" && "healthy",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full",
          tone === "alert" && "bg-coral/10 text-coral",
          tone === "healthy" && "bg-mint/10 text-mint",
          tone === "brand" && "bg-accent/10 text-accent",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-muted mb-1 text-[11px] font-medium tracking-[0.18em] uppercase">
          {kicker}
        </p>
        <p className="font-display text-[1.15rem] leading-snug font-semibold text-fg md:text-[1.35rem]">
          {children}
        </p>
      </div>
    </aside>
  );
}
