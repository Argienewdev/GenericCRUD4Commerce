import { useState } from "react";
import { Menu, X, Plus, ShoppingCart } from "lucide-react";
import type { PanelConfig } from "../../config/panelConfig";

interface HeaderProps {
  config: PanelConfig;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ config, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
	
	const activePanel = config.id;
  const ModalComponent = config.Modal;

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

      <div className="flex items-center gap-4">
        {activePanel === "stock" && (
          <button
            onClick={() => console.log("Abrir modal de Nueva Venta")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
          >
            <ShoppingCart size={20} />
            Nueva Venta
          </button>
        )}

        {config.newButtonLabel && ModalComponent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            {config.newButtonLabel}
          </button>
        )}
      </div>

      {ModalComponent && (
        <ModalComponent
					key={activePanel}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
