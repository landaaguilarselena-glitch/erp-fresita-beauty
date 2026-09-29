import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PRODUCT_COLOR } from "@/lib/erp/brand";
import { soles } from "@/lib/erp/format";
import type { MonthlyRow } from "@/lib/erp/types";
import { ChartTooltip } from "./chart-tooltip";

const BARS = [
  { key: "Labial Berry Chic" as const, color: PRODUCT_COLOR["Labial Berry Chic"] },
  { key: "Rubor Secret Berry" as const, color: PRODUCT_COLOR["Rubor Secret Berry"] },
  { key: "Gloss Berry Cute" as const, color: PRODUCT_COLOR["Gloss Berry Cute"] },
];

export function QuarterBars({ data }: { data: MonthlyRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart data={data} barGap={4} barCategoryGap="28%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(74,21,75,0.06)" />
        <XAxis
          dataKey="mes"
          tick={{ fill: "#7A6B73", fontSize: 12, fontFamily: "Outfit" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) =>
            v >= 1000 ? `S/ ${(v / 1000).toFixed(0)}k` : soles(v)
          }
          tick={{ fill: "#7A6B73", fontSize: 11, fontFamily: "Outfit" }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ fill: "rgba(216,0,95,0.04)" }}
          content={<ChartTooltip />}
        />
        {BARS.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            fill={b.color}
            radius={[8, 8, 4, 4]}
            maxBarSize={28}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
