import { Menu, X, Search, Plus } from 'lucide-react';
import type { PanelType } from '../../config/panelConfig';

interface HeaderProps {
  activePanel: PanelType;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewAction?: () => void;
}

export function Header({ activePanel, sidebarOpen, onToggleSidebar, onNewAction }: HeaderProps) {
  const getActionButtonLabel = () => {
    switch (activePanel) {
      case 'stock': return 'Nuevo Producto';
      case 'ventas': return 'Nueva Venta';
      case 'clientes': return 'Nuevo Cliente';
      case 'vendedores': return 'Nuevo Vendedor';
      default: return null;
    }
  };

  const actionLabel = getActionButtonLabel();

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-all"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="text-2xl font-bold text-slate-800 capitalize">
          {activePanel}
        </h2>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
          />
        </div>
        
        {actionLabel && (
          <button 
            onClick={onNewAction}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus size={20} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}