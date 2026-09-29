import { cn } from "@/lib/utils";
import { num } from "@/lib/erp/format";
import { weeksOfCover } from "@/lib/erp/inventory";
import type { InventoryProduct } from "@/lib/erp/types";

export function ReorderMonitor({ products }: { products: InventoryProduct[] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-7">
      {products.map((p) => {
        const max = Math.max(p.capacity, p.currentStock);
        const stockPct = (p.currentStock / max) * 100;
        const reorderPct = (p.reorderPoint / max) * 100;
        const critical = p.currentStock <= p.reorderPoint;
        const cover = weeksOfCover(p);
        return (
          <div key={p.name}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">{p.name}</p>
                <p className="text-muted text-[11px]">
                  Capacidad {num(p.capacity)} · Reorden {num(p.reorderPoint)} ·{" "}
                  {cover.toFixed(1).replace(".", ",")} sem. de cobertura
                </p>
              </div>
              <div className="flex items-center gap-2">
                {critical ? (
                  <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-coral uppercase">
                    Alerta
                  </span>
                ) : null}
                <span className="font-display text-lg font-semibold tabular-nums text-fg">
                  {num(p.currentStock)}
                </span>
              </div>
            </div>
            <div className="relative h-7 overflow-hidden rounded-full bg-capacity">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500",
                  critical ? "bg-coral" : "bg-mint",
                )}
                style={{ width: `${stockPct}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-px bg-fg"
                style={{ left: `${reorderPct}%` }}
                title={`Punto de reorden ${p.reorderPoint}`}
              />
              <div
                className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
                style={{ left: `${reorderPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
