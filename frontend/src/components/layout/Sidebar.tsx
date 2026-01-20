import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { PanelType } from '../../config/panelConfig';
import type { MenuItem } from '../../types/dashboard';

interface SidebarProps {
  isOpen: boolean;
  activePanel: PanelType;
  menuItems: MenuItem[];
  onPanelChange: (panel: PanelType) => void;
}

export function Sidebar({ isOpen, activePanel, menuItems, onPanelChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white shadow-lg transition-all duration-300 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-blue-600">StockApp</h1>
        <p className="text-sm text-slate-500 mt-1">Sistema de Gestión de Stock</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activePanel === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-lg mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{user?.username}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all mb-5"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}