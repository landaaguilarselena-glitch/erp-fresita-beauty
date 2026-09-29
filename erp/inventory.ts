import inventoryJson from "@/data/inventory.json";
import type { InventoryProduct, InventorySnapshot, ProductName } from "./types";

const raw = inventoryJson as {
  products: InventoryProduct[];
  asOf: string;
};

export const INVENTORY_PRODUCTS = raw.products.map((p) => ({
  ...p,
  currentStock: Math.round(p.currentStock),
  initialStock: Math.round(p.initialStock),
  totalOutflows: Math.round(p.totalOutflows),
})) as InventoryProduct[];

export function analyzeInventory(): InventorySnapshot {
  const products = INVENTORY_PRODUCTS;
  const totalUnits = products.reduce((a, p) => a + p.currentStock, 0);
  const atRisk = products.filter((p) => p.currentStock <= p.reorderPoint);
  return { products, asOf: raw.asOf, totalUnits, atRisk };
}

export function weeksOfCover(p: InventoryProduct) {
  const weeklyDemand = p.totalOutflows / 13;
  if (weeklyDemand <= 0) return Infinity;
  return p.currentStock / weeklyDemand;
}

export function productByName(name: ProductName) {
  return INVENTORY_PRODUCTS.find((p) => p.name === name);
}
