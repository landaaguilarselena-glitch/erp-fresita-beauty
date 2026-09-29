import { num, pct, soles } from "@/lib/erp/format";
import type { NamedTotal } from "@/lib/erp/types";

export function ShareList({
  items,
  labelFor,
  accent,
}: {
  items: NamedTotal[];
  labelFor?: (name: string) => string;
  accent?: (name: string) => string;
}) {
  const top = items[0]?.value || 1;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate font-medium text-fg">
              {labelFor ? labelFor(item.name) : item.name}
            </span>
            <span className="text-muted shrink-0 tabular-nums">
              {soles(item.value)} · {pct(item.share)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-capacity">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / top) * 100}%`,
                background: accent?.(item.name) ?? "#D8005F",
              }}
            />
          </div>
        </li>
      ))}
      {items.length === 0 ? (
        <li className="text-muted text-sm">Sin datos en el recorte.</li>
      ) : null}
      <p className="sr-only">{num(items.length)} series</p>
    </ul>
  );
}
