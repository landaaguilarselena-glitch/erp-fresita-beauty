import salesJson from "@/data/sales.json";
import { MONTH_LABEL } from "./brand";
import type {
  MonthlyRow,
  NamedTotal,
  ProductName,
  Sale,
  SalesFilters,
  SalesSnapshot,
} from "./types";
import { PRODUCTS } from "./types";

export const SALES = salesJson as Sale[];

export const EMPTY_FILTERS: SalesFilters = {
  producto: "all",
  canal: "all",
  asesor: "all",
  mes: "all",
};

export const CANALES = [...new Set(SALES.map((s) => s.canal))].sort();
export const ASESORES = [...new Set(SALES.map((s) => s.asesor))].sort();
export const METODOS = [...new Set(SALES.map((s) => s.metodo))].sort();

export function filterSales(rows: Sale[], f: SalesFilters): Sale[] {
  return rows.filter((r) => {
    if (f.producto !== "all" && r.producto !== f.producto) return false;
    if (f.canal !== "all" && r.canal !== f.canal) return false;
    if (f.asesor !== "all" && r.asesor !== f.asesor) return false;
    if (f.mes !== "all") {
      const m = new Date(r.fecha).getMonth() + 1;
      if (m !== f.mes) return false;
    }
    return true;
  });
}

function shares(entries: { name: string; value: number }[], total: number): NamedTotal[] {
  return entries
    .map((e) => ({
      ...e,
      share: total > 0 ? (e.value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function analyzeSales(rows: Sale[]): SalesSnapshot {
  const totalSoles = rows.reduce((a, r) => a + r.totalSoles, 0);
  const flujoCajaUsd = rows.reduce((a, r) => a + r.flujoCajaUsd, 0);
  const ingresoNetoUsd = rows.reduce((a, r) => a + r.ingresoNetoUsd, 0);
  const units = rows.reduce((a, r) => a + r.cantidad, 0);
  const clients = new Set(rows.map((r) => r.dni)).size;

  const productMap = new Map<string, number>();
  const canalMap = new Map<string, number>();
  const pagoMap = new Map<string, number>();
  const asesorMap = new Map<string, number>();
  const monthlyMap = new Map<number, MonthlyRow>();

  for (const p of PRODUCTS) {
    productMap.set(p, 0);
  }
  for (const m of [1, 2, 3]) {
    monthlyMap.set(m, {
      mes: MONTH_LABEL[m] ?? String(m),
      month: m,
      "Labial Berry Chic": 0,
      "Rubor Secret Berry": 0,
      "Gloss Berry Cute": 0,
      total: 0,
    });
  }

  let minFecha: string | null = null;
  let maxFecha: string | null = null;

  for (const r of rows) {
    productMap.set(r.producto, (productMap.get(r.producto) ?? 0) + r.totalSoles);
    canalMap.set(r.canal, (canalMap.get(r.canal) ?? 0) + r.totalSoles);
    pagoMap.set(r.metodo, (pagoMap.get(r.metodo) ?? 0) + r.totalSoles);
    asesorMap.set(r.asesor, (asesorMap.get(r.asesor) ?? 0) + r.totalSoles);

    const month = new Date(r.fecha).getMonth() + 1;
    const bucket = monthlyMap.get(month);
    if (bucket && PRODUCTS.includes(r.producto)) {
      bucket[r.producto] += r.totalSoles;
      bucket.total += r.totalSoles;
    }

    if (!minFecha || r.fecha < minFecha) minFecha = r.fecha;
    if (!maxFecha || r.fecha > maxFecha) maxFecha = r.fecha;
  }

  const byProduct = shares(
    [...productMap.entries()].map(([name, value]) => ({ name, value })),
    totalSoles,
  );
  const star = byProduct[0] && byProduct[0].value > 0 ? byProduct[0] : null;

  return {
    rows: rows.length,
    totalSoles,
    flujoCajaUsd,
    ingresoNetoUsd,
    units,
    avgTicket: rows.length ? totalSoles / rows.length : 0,
    clients,
    star,
    byProduct,
    byCanal: shares(
      [...canalMap.entries()].map(([name, value]) => ({ name, value })),
      totalSoles,
    ),
    byPago: shares(
      [...pagoMap.entries()].map(([name, value]) => ({ name, value })),
      totalSoles,
    ),
    byAsesor: shares(
      [...asesorMap.entries()].map(([name, value]) => ({ name, value })),
      totalSoles,
    ),
    monthly: [1, 2, 3].map((m) => monthlyMap.get(m)!),
    from: minFecha,
    to: maxFecha,
  };
}

export function isProductName(v: string): v is ProductName {
  return (PRODUCTS as readonly string[]).includes(v);
}
