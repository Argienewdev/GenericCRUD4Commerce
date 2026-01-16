import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { StockList } from "../components/stock/StockList";
import { SalesList } from "../components/sales/SalesList";
import { ClientsList } from "../components/clients/ClientsList";
import { StatsPanel } from "../components/stats/StatsPanel";
import { SellersList } from "../components/sellers/SellersList";
import { usePanel } from "../hooks/usePanel";
import { getMenuItems, type PanelType } from "../config/panelConfig";
import type { UserInfo } from "../types/auth";
import type { Client, Sale, StockItem } from "../types/dashboard";

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>("stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stockPanel = usePanel<StockItem>("stock");
  const salesPanel = usePanel<Sale>("ventas");
  const clientsPanel = usePanel<Client>("clientes");
  const sellersPanel = usePanel<UserInfo>("vendedores");

  const getCurrentPanel = () => {
    switch (activePanel) {
      case "stock":
        return stockPanel;
      case "ventas":
        return salesPanel;
      case "clientes":
        return clientsPanel;
      case "vendedores":
        return sellersPanel;
      default:
        return null;
    }
  };

  const currentPanel = getCurrentPanel();

  // ============================================
  // HANDLERS
  // ============================================

  const handleNewAction = () => {
    console.log(`Crear nuevo ${currentPanel?.config.newButtonLabel}`);
  };

  const handleEdit = (item: unknown) => {
    console.log("Editar:", item);
  };

  const handleDelete = (id: number) => {
    if (!currentPanel) return;

    console.log("Eliminar:", id);
  };

  const handleViewDetail = (id: number) => {
    console.log("Ver detalle:", id);
  };

  // ============================================
  // RENDER CONTENT
  // ============================================

  const renderContent = () => {
    if (currentPanel?.loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (currentPanel?.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-red-500 text-lg">Error: {currentPanel.error}</div>
          <button
            onClick={currentPanel.refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    switch (activePanel) {
      case "stock":
        return (
          <StockList
            items={stockPanel.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );

      case "ventas":
        return (
          <SalesList ventas={salesPanel.data} onViewDetail={handleViewDetail} />
        );

      case "clientes":
        return (
          <ClientsList
            clientes={clientsPanel.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );

      case "estadisticas":
        return <StatsPanel />;

      case "vendedores":
        return (
          <SellersList
            vendedores={sellersPanel.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );

      default:
        return null;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activePanel={activePanel}
        menuItems={getMenuItems()}
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
        <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );
}