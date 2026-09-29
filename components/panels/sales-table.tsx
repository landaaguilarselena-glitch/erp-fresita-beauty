import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { asesorLabel } from "@/lib/erp/brand";
import { formatDateTime, soles } from "@/lib/erp/format";
import type { Sale } from "@/lib/erp/types";

const PAGE = 8;

export function SalesTable({ rows }: { rows: Sale[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? rows.filter(
          (r) =>
            r.id.toLowerCase().includes(needle) ||
            r.cliente.toLowerCase().includes(needle) ||
            r.dni.includes(needle) ||
            r.producto.toLowerCase().includes(needle),
        )
      : rows;
    return [...list].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [rows, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);

  return (
    <section className="panel-card overflow-hidden">
      <header className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-fg">Libro de ventas</h3>
          <p className="text-muted text-xs">
            {filtered.length} operaciones · ordenadas por fecha
          </p>
        </div>
        <label className="relative w-full sm:max-w-xs">
          <Search className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Buscar cliente, DNI o ID"
            className="h-11 w-full rounded-xl bg-bg pr-3 pl-10 text-sm text-fg shadow-[0_0_0_1px_rgba(74,21,75,0.08)] outline-none focus:shadow-[0_0_0_2px_rgba(216,0,95,0.35)]"
          />
        </label>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-muted border-t border-line text-[10px] tracking-[0.14em] uppercase">
              <th className="px-5 py-2.5 font-medium md:px-6">ID</th>
              <th className="px-3 py-2.5 font-medium">Fecha</th>
              <th className="px-3 py-2.5 font-medium">Cliente</th>
              <th className="px-3 py-2.5 font-medium">Producto</th>
              <th className="px-3 py-2.5 text-right font-medium">Ud.</th>
              <th className="px-3 py-2.5 text-right font-medium">Total</th>
              <th className="px-3 py-2.5 font-medium">Canal</th>
              <th className="px-5 py-2.5 font-medium md:px-6">Asesor</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id} className="border-t border-line/80 hover:bg-accent-soft/40">
                <td className="px-5 py-3 font-medium tabular-nums text-fg md:px-6">{r.id}</td>
                <td className="text-muted px-3 py-3 whitespace-nowrap">
                  {formatDateTime(r.fecha)}
                </td>
                <td className="max-w-[180px] truncate px-3 py-3 text-fg">{r.cliente}</td>
                <td className="px-3 py-3 text-fg">{r.producto}</td>
                <td className="px-3 py-3 text-right tabular-nums">{r.cantidad}</td>
                <td className="px-3 py-3 text-right font-medium tabular-nums text-accent">
                  {soles(r.totalSoles)}
                </td>
                <td className="px-3 py-3">{r.canal}</td>
                <td className="px-5 py-3 md:px-6">{asesorLabel(r.asesor)}</td>
              </tr>
            ))}
            {slice.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-muted px-6 py-10 text-center">
                  No hay ventas que coincidan con la búsqueda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <footer className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 md:px-6">
        <p className="text-muted text-xs tabular-nums">
          Página {safePage + 1} de {pages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex size-10 items-center justify-center rounded-xl bg-bg text-fg disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            disabled={safePage >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex size-10 items-center justify-center rounded-xl bg-bg text-fg disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}
