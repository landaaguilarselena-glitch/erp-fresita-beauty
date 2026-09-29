import { useMemo, useState } from "react";
import { Activity, RotateCcw, ShieldCheck, TriangleAlert, Warehouse } from "lucide-react";
import { ClientOnly } from "@/components/ui/client-only";
import { InsightCard } from "@/components/ui/insight-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { ReorderMonitor } from "@/components/charts/reorder-monitor";
import { StockDonut } from "@/components/charts/stock-donut";
import { num } from "@/lib/erp/format";
import { weeksOfCover } from "@/lib/erp/inventory";
import type { InventorySnapshot } from "@/lib/erp/types";
import { cn } from "@/lib/utils";

export function InventoryPanel({ snapshot }: { snapshot: InventorySnapshot }) {
  const { products, atRisk, totalUnits } = snapshot;
  const [active, setActive] = useState(products[0]?.name ?? "Labial Berry Chic");
  const selected = products.find((p) => p.name === active) ?? products[0];

  const fastest = useMemo(
    () => [...products].sort((a, b) => b.rotation - a.rotation)[0],
    [products],
  );

  const insight =
    atRisk.length > 0
      ? `Riesgo de quiebre en ${atRisk.map((p) => p.name).join(", ")}. Emitir orden de compra prioritaria hoy.`
      : `Stock saludable en los tres SKU. ${fastest ? `${fastest.name} rota ${fastest.rotation.toString().replace(".", ",")} veces en el trimestre — el más ágil del portafolio.` : ""}`;

  const avgRotation =
    products.reduce((a, p) => a + p.rotation, 0) / Math.max(products.length, 1);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <InsightCard
        icon={atRisk.length ? TriangleAlert : ShieldCheck}
        kicker="Insight operativo"
        tone={atRisk.length ? "alert" : "healthy"}
      >
        {insight}
      </InsightCard>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Stock actual"
          value={num(totalUnits)}
          hint="Unidades en almacén al cierre de marzo"
          icon={Warehouse}
        />
        <KpiCard
          label="Rotación media"
          value={avgRotation.toFixed(2).replace(".", ",")}
          hint="Salidas / inventario promedio · Q1"
          icon={RotateCcw}
        />
        <KpiCard
          label="Salidas del trimestre"
          value={num(products.reduce((a, p) => a + p.totalOutflows, 0))}
          hint="Unidades despachadas en 13 semanas"
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel-card min-w-0 overflow-hidden p-5 md:p-6">
          <h3 className="font-display text-xl font-semibold text-fg">
            Distribución de stock
          </h3>
          <p className="text-muted mb-2 text-xs">Participación del inventario actual</p>
          <div className="h-64 min-w-0 overflow-hidden">
            <ClientOnly
              fallback={<div className="h-full animate-pulse rounded-full bg-capacity" />}
            >
              <StockDonut products={products} total={totalUnits} />
            </ClientOnly>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
            {products.map((p) => (
              <li key={p.name} className="flex items-center gap-1.5 text-muted">
                <span className="size-2 rounded-full" style={{ background: p.color }} />
                {p.short} · {num(p.currentStock)}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-card min-w-0 overflow-hidden p-5 md:p-6">
          <h3 className="font-display text-xl font-semibold text-fg">
            Monitor de reorden
          </h3>
          <p className="text-muted mb-5 text-xs">
            Barra de stock sobre capacidad · línea vertical = punto de reorden
          </p>
          <ReorderMonitor products={products} />
        </section>
      </div>

      <section className="panel-card overflow-hidden">
        <header className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h3 className="font-display text-xl font-semibold text-fg">Kardex semanal</h3>
            <p className="text-muted text-xs">
              Movimientos, compras y salidas · {selected?.name}
              {selected
                ? ` · ${weeksOfCover(selected).toFixed(1).replace(".", ",")} semanas de cobertura`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActive(p.name)}
                className={cn(
                  "h-10 rounded-full px-3.5 text-sm font-medium transition-colors duration-150",
                  active === p.name
                    ? "bg-accent text-on-accent"
                    : "bg-bg text-fg hover:bg-accent-soft",
                )}
              >
                {p.short}
              </button>
            ))}
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-muted border-t border-line text-[10px] tracking-[0.14em] uppercase">
                <th className="px-5 py-2.5 font-medium md:px-6">Periodo</th>
                <th className="px-3 py-2.5 font-medium">Tipo</th>
                <th className="px-3 py-2.5 text-right font-medium">Cantidad</th>
                <th className="px-3 py-2.5 text-right font-medium">Ingresos</th>
                <th className="px-3 py-2.5 text-right font-medium">Salidas</th>
                <th className="px-5 py-2.5 text-right font-medium md:px-6">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {selected?.movements.map((m, i) => (
                <tr key={`${m.periodo}-${m.tipo}-${i}`} className="border-t border-line/80">
                  <td className="px-5 py-2.5 text-fg md:px-6">{m.periodo}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        m.tipo === "Ventas" && "bg-accent-soft text-accent",
                        m.tipo === "Compras" && "bg-mint/10 text-mint",
                        m.tipo === "Saldo Inicial" && "bg-capacity text-muted",
                      )}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {m.cantidad != null ? num(m.cantidad) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-mint">
                    {m.ingresos != null ? num(m.ingresos) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-accent">
                    {m.salidas != null ? num(m.salidas) : "—"}
                  </td>
                  <td className="px-5 py-2.5 text-right font-medium tabular-nums md:px-6">
                    {m.saldoFinal != null ? num(m.saldoFinal) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected ? (
          <footer className="text-muted flex flex-wrap gap-x-6 gap-y-1 border-t border-line px-5 py-3 text-xs md:px-6">
            <span>
              Inventario promedio{" "}
              <strong className="text-fg">{num(selected.avgInventory, 2)}</strong>
            </span>
            <span>
              Rotación{" "}
              <strong className="text-fg">{selected.rotation.toString().replace(".", ",")}</strong>
            </span>
            <span>
              Punto de reorden{" "}
              <strong className="text-fg">{num(selected.reorderPoint)}</strong>
            </span>
          </footer>
        ) : null}
      </section>
    </div>
  );
}
