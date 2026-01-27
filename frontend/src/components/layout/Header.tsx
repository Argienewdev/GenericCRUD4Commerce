import { Menu, X } from "lucide-react";
import type { PanelConfig } from "../../config/panelConfig";

interface HeaderProps {
  config: PanelConfig;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ config, sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-600"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{config.pageTitle}</h2>
      </div>
    </div>
  );
}
