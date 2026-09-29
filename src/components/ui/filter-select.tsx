import { cn } from "@/lib/utils";

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-muted text-[10px] font-medium tracking-[0.16em] uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full appearance-none rounded-xl bg-bg px-3 pr-8 text-sm text-fg",
          "shadow-[0_0_0_1px_rgba(74,21,75,0.08)] outline-none",
          "transition-[box-shadow] duration-150",
          "focus:shadow-[0_0_0_2px_rgba(216,0,95,0.35)]",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%237A6B73' d='M1 1l5 5 5-5'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
