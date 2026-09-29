import type { ReactNode } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export type PanelId = "ventas" | "inventario";

export function AppShell({
  panel,
  onPanel,
  children,
}: {
  panel: PanelId;
  onPanel: (id: PanelId) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
          <BrandBlock />
          <Nav panel={panel} onPanel={onPanel} className="mt-10 flex-col" />
          <p className="text-muted mt-auto text-[11px] leading-relaxed">
            ERP interno · Q1 2026
            <br />
            Datos reales de ventas y kardex
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <img
              src="/logo_fresita.png"
              alt="Fresita Beauty"
              width={120}
              height={48}
              className="h-10 w-auto rounded-lg bg-fg object-contain px-2"
            />
            <Nav panel={panel} onPanel={onPanel} className="ml-auto" compact />
          </header>

          <main className="flex-1 px-4 py-5 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function BrandBlock() {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-fg">
        <img
          src="/logo_fresita.png"
          alt="Fresita Beauty"
          width={200}
          height={80}
          className="h-auto w-full object-contain"
        />
      </div>
      <p className="text-muted mt-3 text-[10px] font-medium tracking-[0.2em] uppercase">
        Dashboard ERP
      </p>
    </div>
  );
}

function Nav({
  panel,
  onPanel,
  className,
  compact,
}: {
  panel: PanelId;
  onPanel: (id: PanelId) => void;
  className?: string;
  compact?: boolean;
}) {
  const items = [
    { id: "ventas" as const, label: "Reporte de Ventas", short: "Ventas", icon: ShoppingBag },
    { id: "inventario" as const, label: "Control de Inventarios", short: "Inventario", icon: Package },
  ];
  return (
    <nav className={cn("flex gap-1.5", className)} aria-label="Módulos">
      {items.map((item) => {
        const active = panel === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onPanel(item.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl text-left font-medium transition-colors duration-150",
              compact ? "h-10 px-3 text-xs" : "h-11 w-full px-3 text-sm",
              active ? "bg-accent text-on-accent" : "text-fg hover:bg-accent-soft",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            <span>{compact ? item.short : item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
