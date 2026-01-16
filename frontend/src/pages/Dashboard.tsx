import { useState } from "react";
// Layout
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
// Listas
import { StockList } from "../components/stock/StockList";
import { SalesList } from "../components/sales/SalesList";
import { ClientsList } from "../components/clients/ClientsList";
import { SellersList } from "../components/sellers/SellersList";
import { StatsPanel } from "../components/stats/StatsPanel";
// Modals
import { ClientModal } from "../components/modals/ClientModal";
import { ProductModal } from "../components/modals/ProductModal";
// Configuración y Hooks
import { usePanel } from "../hooks/usePanel";
import { PANEL_CONFIG, getMenuItems, type PanelType } from "../config/panelConfig";

const API_BASE_URL = "http://localhost:8080/api/v1/";

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
      endpoint: `${API_BASE_URL}/products`,
      RenderList: StockList,
      RenderModal: ProductModal
    },
    clientes: {
      dataHook: clientsPanel,
      endpoint: `${API_BASE_URL}/clients`,
      RenderList: ClientsList,
      RenderModal: ClientModal
    },
    ventas: {
      dataHook: salesPanel,
      endpoint: `${API_BASE_URL}/sales`,
      RenderList: SalesList,
      RenderModal: null
    },
    vendedores: {
      dataHook: sellersPanel,
      endpoint: `${API_BASE_URL}/sellers`,
      RenderList: SellersList,
      RenderModal: null
    },
    estadisticas: {
      dataHook: { data: [], loading: false, error: null, refetch: () => {} },
      endpoint: null,
      RenderList: StatsPanel,
      RenderModal: null
    }
  };

  const currentView = viewConfig[activePanel];

  // ============================================
  // HANDLERS
  // ============================================

  const handleDelete = async (id: number) => {
    if (!currentView.endpoint) return;
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    try {
      const response = await fetch(`${currentView.endpoint}/${id}`, { method: "DELETE" });
      if (response.ok) {
        currentView.dataHook.refetch();
      } else {
        alert("Error al eliminar");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };

  const handleCreate = async (data: any) => {
    if (!currentView.endpoint) return;

    try {
      const response = await fetch(currentView.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 409) {
          const err = await response.json();
          alert(err.error || "Dato duplicado");
        } else {
          throw new Error("Error al crear");
        }
        return;
      }

      currentView.dataHook.refetch();
      setIsModalOpen(false);
      alert("Creado con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
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