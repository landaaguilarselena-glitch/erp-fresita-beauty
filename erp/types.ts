export const PRODUCTS = [
  "Labial Berry Chic",
  "Rubor Secret Berry",
  "Gloss Berry Cute",
] as const;

export type ProductName = (typeof PRODUCTS)[number];

export type Sale = {
  id: string;
  fecha: string;
  dni: string;
  cliente: string;
  producto: ProductName;
  precio: number;
  cantidad: number;
  subtotal: number;
  igv: number;
  totalSoles: number;
  ingresoNetoUsd: number;
  flujoCajaUsd: number;
  metodo: string;
  canal: string;
  asesor: string;
};

export type SalesFilters = {
  producto: "all" | ProductName;
  canal: "all" | string;
  asesor: "all" | string;
  mes: "all" | 1 | 2 | 3;
};

export type NamedTotal = { name: string; value: number; share: number };

export type MonthlyRow = {
  mes: string;
  month: number;
  "Labial Berry Chic": number;
  "Rubor Secret Berry": number;
  "Gloss Berry Cute": number;
  total: number;
};

export type SalesSnapshot = {
  rows: number;
  totalSoles: number;
  flujoCajaUsd: number;
  ingresoNetoUsd: number;
  units: number;
  avgTicket: number;
  clients: number;
  star: NamedTotal | null;
  byProduct: NamedTotal[];
  byCanal: NamedTotal[];
  byPago: NamedTotal[];
  byAsesor: NamedTotal[];
  monthly: MonthlyRow[];
  from: string | null;
  to: string | null;
};

export type KardexMove = {
  periodo: string | null;
  tipo: string;
  cantidad: number | null;
  saldoInicial: number | null;
  ingresos: number | null;
  salidas: number | null;
  saldoFinal: number | null;
};

export type InventoryProduct = {
  name: ProductName;
  short: string;
  capacity: number;
  reorderPoint: number;
  color: string;
  initialStock: number;
  currentStock: number;
  avgInventory: number;
  rotation: number;
  totalOutflows: number;
  movements: KardexMove[];
};

export type InventorySnapshot = {
  products: InventoryProduct[];
  asOf: string;
  totalUnits: number;
  atRisk: InventoryProduct[];
};
