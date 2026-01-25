import { Menu, X, Search, Plus, ShoppingCart } from 'lucide-react';
import type { PanelType } from '../../config/panelConfig';
import { PANEL_CONFIG } from '../../config/panelConfig';

interface HeaderProps {
  activePanel: PanelType;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewAction?: () => void;
  onSaleAction?: () => void;
  showNewButton?: boolean;
}

export function Header({
  activePanel,
  sidebarOpen,
  onToggleSidebar,
  onNewAction,
  onSaleAction,
  showNewButton = true
}: HeaderProps) {
  const config = PANEL_CONFIG[activePanel];

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

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder={config.searchPlaceholder || "Buscar..."}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
          />
        </div>

        {config.newButtonLabel && showNewButton && (
          <div className="flex items-center gap-2">
            {activePanel === "stock" && onSaleAction && (
              <button
                onClick={onSaleAction}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Realizar Venta</span>
              </button>
            )}
            <button
              onClick={onNewAction}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">{config.newButtonLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}