import { soles } from "@/lib/erp/format";

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = soles,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
  valueFormatter?: (n: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl bg-surface px-3.5 py-3 shadow-[0_10px_30px_rgba(216,0,95,0.14)]">
      {label ? (
        <p className="text-muted mb-2 text-[10px] font-medium tracking-[0.14em] uppercase">
          {label}
        </p>
      ) : null}
      <ul className="space-y-1.5">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center gap-2 text-sm">
            <span
              className="size-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-muted">{p.name}</span>
            <span className="ml-auto font-medium tabular-nums text-fg">
              {valueFormatter(Number(p.value ?? 0))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
