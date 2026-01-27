import { Menu, X, Search, Plus, ShoppingCart } from "lucide-react";
import type { PanelConfig } from "../../config/panelConfig";

interface HeaderProps {
  config: PanelConfig;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNew: () => void;
  onSale: () => void;
}

export function Header({
  config,
  sidebarOpen,
  onToggleSidebar,
  onNew,
  onSale,
}: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-600"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <h2 className="text-2xl font-bold text-slate-800">
          {config.pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {config.searchPlaceholder && (
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              placeholder={config.searchPlaceholder}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {config.showSaleButton && (
            <button
              onClick={onSale}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
            >
              <ShoppingCart size={20} />
              Realizar Venta
            </button>
          )}

          {config.newButtonLabel && (
            <button
              onClick={onNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} />
              {config.newButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
