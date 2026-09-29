import type { ProductName } from "./types";

export const TC_PEN_PER_USD = 3.44;

export const PRODUCT_COLOR: Record<ProductName, string> = {
  "Labial Berry Chic": "#D8005F",
  "Rubor Secret Berry": "#FF66A3",
  "Gloss Berry Cute": "#FFB3D9",
};

export const PRODUCT_SOFT: Record<ProductName, string> = {
  "Labial Berry Chic": "#FFF0F5",
  "Rubor Secret Berry": "#FFE4F0",
  "Gloss Berry Cute": "#FFF5FA",
};

export const ASESOR_LABEL: Record<string, string> = {
  Selena_L: "Selena L.",
  Nadia_D: "Nadia D.",
  Azumy_C: "Azumy C.",
};

export function asesorLabel(code: string) {
  return ASESOR_LABEL[code] ?? code.replace("_", " ");
}

export const MONTH_LABEL: Record<number, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
};
