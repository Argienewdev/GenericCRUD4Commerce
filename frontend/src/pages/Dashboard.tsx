// pages/DashboardPage.tsx

import { useState } from 'react';
import { Package, DollarSign, Users, BarChart3, UserCog } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { StockList } from '../components/stock/StockList';
import { 
	type MenuItem, 
	type PanelType, 
	type StockItem, 
	type Venta, 
	type Cliente, 
	type Vendedor 
} from '../types/dashboard';
import { SalesList } from '../components/sales/SalesList';
import { ClientsList } from '../components/clients/ClientsList';
import { StatsPanel } from '../components/stats/StatsPanel';
import { SellersList } from '../components/sellers/SellersList';

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>('stock');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Menu Items
  const menuItems: MenuItem[] = [
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'ventas', label: 'Ventas', icon: DollarSign },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'vendedores', label: 'Vendedores', icon: UserCog },
  ];

  // Mock Data - Stock
  const stockItems: StockItem[] = [
    { id: 1, name: 'Notebook HP Pavilion', description: 'Intel Core i5, 8GB RAM, 256GB SSD', price: 145000, stock: 8 },
    { id: 2, name: 'Mouse Logitech MX Master', description: 'Inalámbrico, ergonómico, 7 botones', price: 12500, stock: 24 },
    { id: 3, name: 'Teclado Mecánico Redragon', description: 'RGB, switches blue, español', price: 18900, stock: 15 },
    { id: 4, name: 'Monitor Samsung 24"', description: 'Full HD, IPS, 75Hz', price: 89000, stock: 12 },
    { id: 5, name: 'Auriculares HyperX Cloud', description: 'Gaming, micrófono desmontable', price: 24500, stock: 18 },
  ];

  // Mock Data - Ventas
  const ventasData: Venta[] = [
    { id: 1, total: 157500, date: '12/01/2026', client: 'Juan Pérez', productos: 3, vendedor: 'María García' },
    { id: 2, total: 89000, date: '11/01/2026', client: 'Laura Martínez', productos: 1, vendedor: 'Carlos López' },
    { id: 3, total: 245900, date: '10/01/2026', client: 'Roberto Silva', productos: 5, vendedor: 'María García' },
    { id: 4, total: 31400, date: '09/01/2026', client: 'Ana Rodríguez', productos: 2, vendedor: 'Carlos López' },
  ];

  // Mock Data - Clientes
  const clientes: Cliente[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '35.456.789', telefono: '2914567890', domicilio: 'Av. Alem 1234' },
    { id: 2, nombre: 'Laura', apellido: 'Martínez', dni: '38.234.567', telefono: '2914123456', domicilio: 'San Martín 567' },
    { id: 3, nombre: 'Roberto', apellido: 'Silva', dni: '32.890.123', telefono: '2914789012', domicilio: 'Brown 890' },
    { id: 4, nombre: 'Ana', apellido: 'Rodríguez', dni: '40.567.234', telefono: '2914345678', domicilio: 'Belgrano 2345' },
  ];

  // Mock Data - Vendedores
  const vendedores: Vendedor[] = [
    { id: 1, nombre: 'María García', email: 'maria@stock.com', rol: 'Usuario', ventas: 15 },
    { id: 2, nombre: 'Carlos López', email: 'carlos@stock.com', rol: 'Usuario', ventas: 12 },
    { id: 3, nombre: 'Admin Principal', email: 'admin@stock.com', rol: 'Admin', ventas: 0 },
  ];

  // Handlers
  const handleNewAction = () => {
    console.log(`Crear nuevo ${activePanel}`);
    // Aquí irá la lógica para abrir modales de creación
  };

  const handleEdit = (item: unknown) => {
    console.log('Editar:', item);
    // Aquí irá la lógica para editar
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar:', id);
    // Aquí irá la lógica para eliminar
  };

  const handleViewDetail = (id: number) => {
    console.log('Ver detalle:', id);
    // Aquí irá la lógica para ver detalles
  };

  // Render Content based on active panel
  const renderContent = () => {
    switch (activePanel) {
      case 'stock':
        return (
          <StockList 
            items={stockItems} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      
      case 'ventas':
        return (
          <SalesList 
            ventas={ventasData}
            onViewDetail={handleViewDetail}
          />
        );
      
      case 'clientes':
        return (
          <ClientsList 
            clientes={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      
      case 'estadisticas':
        return <StatsPanel />;
      
      case 'vendedores':
        return (
          <SellersList 
            vendedores={vendedores}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activePanel={activePanel}
        menuItems={menuItems}
        onPanelChange={setActivePanel}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          activePanel={activePanel}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewAction={handleNewAction}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}