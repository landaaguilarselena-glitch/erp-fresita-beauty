import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, type PanelId } from "@/components/layout/app-shell";
import { InventoryPanel } from "@/components/panels/inventory-panel";
import { SalesPanel } from "@/components/panels/sales-panel";
import { analyzeInventory } from "@/lib/erp/inventory";
import { analyzeSales, EMPTY_FILTERS, filterSales, SALES } from "@/lib/erp/sales";
import { num } from "@/lib/erp/format";
import type { SalesFilters } from "@/lib/erp/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [panel, setPanel] = useState<PanelId>("ventas");
  const [filters, setFilters] = useState<SalesFilters>(EMPTY_FILTERS);
  const inventory = useMemo(() => analyzeInventory(), []);
  const rows = useMemo(() => filterSales(SALES, filters), [filters]);
  const snapshot = useMemo(() => analyzeSales(rows), [rows]);

  return (
    <AppShell panel={panel} onPanel={setPanel}>
      <div className="mb-6 flex flex-col gap-1 md:mb-8">
        <p className="text-muted text-[11px] font-medium tracking-[0.2em] uppercase">
          {panel === "ventas" ? "Comercial" : "Logística"} · Q1 2026
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {panel === "ventas" ? "Reporte de ventas" : "Control de inventarios"}
        </h1>
        <p className="text-muted max-w-2xl text-sm">
          {panel === "ventas"
            ? `${num(snapshot.rows)} operaciones depuradas · ${num(snapshot.clients)} clientas · 1 ene – 31 mar 2026`
            : `Kardex estratégico al 31 mar 2026 · ${num(inventory.totalUnits)} unidades en piso`}
        </p>
      </div>

      {panel === "ventas" ? (
        <SalesPanel
          filters={filters}
          onChange={setFilters}
          snapshot={snapshot}
          rows={rows}
        />
      ) : (
        <InventoryPanel snapshot={inventory} />
      )}
    </AppShell>
  );
}
