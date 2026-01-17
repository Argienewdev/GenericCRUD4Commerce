import { useState } from "react";
// Layout
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
// Lists
import { StockList } from "../components/stock/StockList";
import { SalesList } from "../components/sales/SalesList";
import { ClientsList } from "../components/clients/ClientsList";
import { SellersList } from "../components/sellers/SellersList";
import { StatsPanel } from "../components/stats/StatsPanel";
// Modals
import { ClientModal } from "../components/modals/ClientModal";
import { ProductModal } from "../components/modals/ProductModal";
// Hooks and config
import { usePanel } from "../hooks/usePanel";
import { PANEL_CONFIG, getMenuItems, type PanelType } from "../config/panelConfig";
//Services
import { stockService } from "../services/stockService";
import { clientsService } from "../services/clientsService";
import { salesService } from "../services/salesService";
import { usersService } from "../services/usersService";
import type { ApiError } from "../services/apiClient";

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>("stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hooks de datos
  const stockPanel = usePanel("stock");
  const salesPanel = usePanel("ventas");
  const clientsPanel = usePanel("clientes");
  const sellersPanel = usePanel("vendedores");

  const staticConfig = PANEL_CONFIG[activePanel];

  // ========================================================================
  // CONFIGURACIÓN VISUAL (Mapeo de Componentes)
  // ========================================================================
  const viewConfig = {
    stock: {
      dataHook: stockPanel,
      deleteAction: stockService.deleteProduct, // <-- Nuevo: función del servicio
      createAction: stockService.createProduct, // <-- Nuevo
      RenderList: StockList,
      RenderModal: ProductModal
    },
    clientes: {
      dataHook: clientsPanel,
      deleteAction: clientsService.deleteClient,
      createAction: clientsService.createClient,
      RenderList: ClientsList,
      RenderModal: ClientModal
    },
    ventas: {
      dataHook: salesPanel,
      deleteAction: salesService.deleteSale,
      createAction: salesService.createSale,
      RenderList: SalesList,
      RenderModal: null
    },
    vendedores: {
      dataHook: sellersPanel,
      deleteAction: usersService.deleteUser,
      createAction: usersService.createUser,
      RenderList: SellersList,
      RenderModal: null
    },
    estadisticas: {
      dataHook: { data: [], loading: false, error: null, refetch: () => {} },
      deleteAction: null,
      createAction: null,
      RenderList: StatsPanel,
      RenderModal: null
    }
  };

  const currentView = viewConfig[activePanel];

  // ============================================
  // HANDLERS
  // ============================================

  const handleDelete = async (id: number) => {
    if (!currentView.deleteAction) return;
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      await currentView.deleteAction(id);
      currentView.dataHook.refetch();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar el registro.");
    }
  };

  const handleCreate = async (data: any) => {
    if (!currentView.createAction) return;

    try {
      await currentView.createAction(data);
      
      currentView.dataHook.refetch();
      setIsModalOpen(false);
      alert("Creado con éxito");

    } catch (error: any) {
      console.error(error);
      const apiError = error as ApiError;
      
      // Manejo de errores específico
      if (apiError.status === 409) {
         alert("Error: El registro ya existe.");
      } else {
         alert(apiError.message || "Error al guardar");
      }
    }
  };

  const handleEdit = (item: any) => {
    console.log("Editar:", item);
  };

  const handleNewAction = () => {
    if (currentView.RenderModal) {
      setIsModalOpen(true);
    } else if (staticConfig.newButtonLabel) {
      alert(`La creación de ${staticConfig.label} aún no está implementada.`);
      console.log(`Intento de crear en panel: ${activePanel}`);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const { data, loading, error, refetch } = currentView.dataHook;
  const ListComponent = currentView.RenderList as any;
  const ModalComponent = currentView.RenderModal;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        activePanel={activePanel}
        menuItems={getMenuItems()}
        onPanelChange={setActivePanel}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activePanel={activePanel}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewAction={handleNewAction}
          showNewButton={!!staticConfig.newButtonLabel} 
        />

        <div className="flex-1 overflow-y-auto p-6">
          {/* ESTADO DE CARGA */}
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}
          
          {/* ESTADO DE ERROR */}
          {error && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-red-500 text-lg font-medium">
                Error: {String(error)}
              </div>
              <button 
                onClick={refetch} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <ListComponent 
              items={data}
              ventas={data}
              clientes={data}
              vendedores={data}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onViewDetail={(id: number) => console.log(id)}
            />
          )}
        </div>
      </div>

      {/* Renderizado Condicional del Modal */}
      {ModalComponent && (
        <ModalComponent 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}