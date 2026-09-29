import { Banknote, Boxes, DollarSign, Lightbulb } from "lucide-react";
import { asesorLabel, PRODUCT_COLOR, TC_PEN_PER_USD } from "@/lib/erp/brand";
import { num, pct, soles, usd } from "@/lib/erp/format";
import { ASESORES, CANALES } from "@/lib/erp/sales";
import { PRODUCTS } from "@/lib/erp/types";
import type { Sale, SalesFilters, SalesSnapshot } from "@/lib/erp/types";
import { ClientOnly } from "@/components/ui/client-only";
import { FilterSelect } from "@/components/ui/filter-select";
import { InsightCard } from "@/components/ui/insight-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { QuarterBars } from "@/components/charts/quarter-bars";
import { ShareList } from "@/components/charts/share-list";
import { SalesTable } from "./sales-table";

export function SalesPanel({
  filters,
  onChange,
  snapshot,
  rows,
}: {
  filters: SalesFilters;
  onChange: (next: SalesFilters) => void;
  snapshot: SalesSnapshot;
  rows: Sale[];
}) {
  const starCopy = snapshot.star
    ? `El producto estrella es ${snapshot.star.name} representando el ${pct(snapshot.star.share)} de los ingresos. Se sugiere inyectar pauta digital para maximizar el margen bruto.`
    : "No hay ventas en el recorte seleccionado. Amplía los filtros para volver a ver el portafolio.";

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <InsightCard icon={Lightbulb} kicker="Insight estratégico">
        {starCopy}
      </InsightCard>

      <div className="panel-card flex flex-col gap-3 p-4 md:flex-row md:items-end md:gap-4 md:px-5">
        <FilterSelect
          label="Producto"
          value={filters.producto}
          onChange={(v) =>
            onChange({
              ...filters,
              producto: v === "all" ? "all" : (v as SalesFilters["producto"]),
            })
          }
          options={[
            { value: "all", label: "Todo el portafolio" },
            ...PRODUCTS.map((p) => ({ value: p, label: p })),
          ]}
        />
        <FilterSelect
          label="Canal"
          value={filters.canal}
          onChange={(v) => onChange({ ...filters, canal: v })}
          options={[
            { value: "all", label: "Física y online" },
            ...CANALES.map((c) => ({ value: c, label: c })),
          ]}
        />
        <FilterSelect
          label="Asesor"
          value={filters.asesor}
          onChange={(v) => onChange({ ...filters, asesor: v })}
          options={[
            { value: "all", label: "Todo el equipo" },
            ...ASESORES.map((a) => ({ value: a, label: asesorLabel(a) })),
          ]}
        />
        <FilterSelect
          label="Mes"
          value={String(filters.mes)}
          onChange={(v) =>
            onChange({
              ...filters,
              mes: v === "all" ? "all" : (Number(v) as 1 | 2 | 3),
            })
          }
          options={[
            { value: "all", label: "Trimestre Q1" },
            { value: "1", label: "Enero" },
            { value: "2", label: "Febrero" },
            { value: "3", label: "Marzo" },
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Flujo de caja total"
          value={soles(snapshot.totalSoles)}
          hint={`Equivalente a ${usd(snapshot.flujoCajaUsd)} al TC ${TC_PEN_PER_USD}`}
          icon={Banknote}
        />
        <KpiCard
          label="Ingreso neto (USD)"
          value={usd(snapshot.ingresoNetoUsd)}
          hint={`TC ${TC_PEN_PER_USD} · margen después de IGV y costo`}
          icon={DollarSign}
        />
        <KpiCard
          label="Unidades vendidas"
          value={num(snapshot.units)}
          hint={`${num(snapshot.rows)} tickets · promedio ${soles(snapshot.avgTicket)}`}
          icon={Boxes}
        />
      </div>

      <section className="panel-card min-w-0 overflow-hidden p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-fg md:text-2xl">
              Evolución trimestral de ingresos
            </h3>
            <p className="text-muted text-xs">Enero – Marzo 2026 · soles facturados por SKU</p>
          </div>
          <ul className="flex flex-wrap gap-3 text-[11px]">
            {PRODUCTS.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-muted">
                <span
                  className="size-2 rounded-full"
                  style={{ background: PRODUCT_COLOR[p] }}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-64 min-w-0 overflow-hidden md:h-80">
          <ClientOnly
            fallback={<div className="h-full animate-pulse rounded-2xl bg-capacity" />}
          >
            <QuarterBars data={snapshot.monthly} />
          </ClientOnly>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel-card min-w-0 p-5 md:p-6">
          <h3 className="font-display mb-1 text-lg font-semibold">Canal</h3>
          <p className="text-muted mb-4 text-xs">Participación sobre ingresos</p>
          <ShareList items={snapshot.byCanal} />
        </section>
        <section className="panel-card min-w-0 p-5 md:p-6">
          <h3 className="font-display mb-1 text-lg font-semibold">Método de pago</h3>
          <p className="text-muted mb-4 text-xs">Yape, Plin, tarjeta y efectivo</p>
          <ShareList items={snapshot.byPago} />
        </section>
        <section className="panel-card min-w-0 p-5 md:p-6">
          <h3 className="font-display mb-1 text-lg font-semibold">Equipo comercial</h3>
          <p className="text-muted mb-4 text-xs">{num(snapshot.clients)} clientas únicas</p>
          <ShareList items={snapshot.byAsesor} labelFor={asesorLabel} />
        </section>
      </div>

      <SalesTable rows={rows} />
    </div>
  );
}
