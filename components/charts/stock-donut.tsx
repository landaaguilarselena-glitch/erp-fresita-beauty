import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { num } from "@/lib/erp/format";
import type { InventoryProduct } from "@/lib/erp/types";
import { ChartTooltip } from "./chart-tooltip";

export function StockDonut({
  products,
  total,
}: {
  products: InventoryProduct[];
  total: number;
}) {
  const data = products.map((p) => ({
    name: p.short,
    value: p.currentStock,
    color: p.color,
  }));

  return (
    <div className="relative h-full w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="88%"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip valueFormatter={(n) => `${num(n)} uds`} />}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-3xl font-semibold tracking-tight text-fg tabular-nums md:text-4xl">
          {num(total)}
        </p>
        <p className="text-muted mt-1 text-[10px] tracking-[0.18em] uppercase">
          unidades
        </p>
      </div>
    </div>
  );
}
