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
import { DeleteConfirmationModal } from "../components/modals/DeleteConfirmationModal";
import { UserModal } from "../components/modals/UserModal";
import { SaleModal } from "../components/modals/SaleModal";
// Hooks and config
import { usePanel } from "../hooks/usePanel";
import { PANEL_CONFIG, getMenuItems, type PanelType } from "../config/panelConfig";
//Services
import { stockService } from "../services/stockService";
import { clientsService } from "../services/clientsService";
import { salesService } from "../services/salesService";
import { usersService } from "../services/usersService";
import type { ApiError } from "../services/apiClient";
import type { Seller, StockItem, Sale, Client } from "../types/dashboard";

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>("stock");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | Client | Seller | null>(null); // Estado para el ítem en edición

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Data hooks
  const stockPanel = usePanel<StockItem>("stock", { enabled: activePanel === "stock" });
  const salesPanel = usePanel<Sale>("ventas", { enabled: activePanel === "ventas" });
  const clientsPanel = usePanel<Client>("clientes", {enabled: activePanel === "clientes" });
  const sellersPanel = usePanel<Seller>("vendedores", { enabled: activePanel === "vendedores" });

  const staticConfig = PANEL_CONFIG[activePanel];

  // ========================================================================
  // Components's mapping
  // ========================================================================
  const viewConfig = {
    stock: {
      dataHook: stockPanel,
      deleteAction: stockService.deleteProduct,
      createAction: stockService.createProduct,
      updateAction: stockService.updateProduct,
      RenderList: StockList,
      RenderModal: ProductModal
    },
    clientes: {
      dataHook: clientsPanel,
      deleteAction: clientsService.deleteClient,
      createAction: clientsService.createClient,
      updateAction: clientsService.updateClient,
      RenderList: ClientsList,
      RenderModal: ClientModal
    },
    ventas: {
      dataHook: salesPanel,
      deleteAction: salesService.deleteSale,
      createAction: salesService.createSale,
      updateAction: null,
      RenderList: SalesList,
      RenderModal: SaleModal
    },
    vendedores: {
      dataHook: sellersPanel,
      deleteAction: usersService.deleteUser,
      createAction: usersService.createUser,
      updateAction: usersService.updateUser,
      RenderList: SellersList,
      RenderModal: UserModal
    },
    estadisticas: {
      dataHook: { data: [], loading: false, error: null, refetch: () => { } },
      deleteAction: null,
      createAction: null,
      updateAction: null,
      RenderList: StatsPanel,
      RenderModal: null
    }
  };

  const currentView = viewConfig[activePanel];

  // ============================================
  // HANDLERS
  // ============================================

  const handleDelete = (id: number) => {
    if (!currentView.deleteAction) return;
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentView.deleteAction || deletingId === null) return;

    try {
      await currentView.deleteAction(deletingId);
      currentView.dataHook.refetch();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar el registro.");
    }
  };

  // Handles creation and edition
  const handleSave = async (data: any) => {
    try {
      if (editingItem && currentView.updateAction) {
        // ACTUALIZAR
        await currentView.updateAction(editingItem.id, data);
      } else if (currentView.createAction) {
        // CREAR
        await currentView.createAction(data);
      }

      currentView.dataHook.refetch();
      handleCloseModal();

    } catch (error: any) {
      console.error(error);
      const apiError = error as ApiError;

      if (apiError.status === 409) {
        alert("Error: El registro ya existe.");
      } else {
        alert(apiError.message || "Error al guardar");
      }
    }
  };

  const handleSaleSave = async (saleDTO: any) => {
    try {
      await salesService.createSale(saleDTO);
      salesPanel.refetch();
      stockPanel.refetch(); // Refrescar stock tras la venta
      handleCloseModal();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error al realizar la venta");
    }
  };


  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleNewAction = () => {
    if (currentView.RenderModal) {
      setEditingItem(null); // Aseguramos que no haya ítem en edición
      setIsModalOpen(true);
    } else if (staticConfig.newButtonLabel) {
      alert(`La creación de ${staticConfig.label} aún no está implementada.`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSaleModalOpen(false);
    setEditingItem(null);
  };

  const handleSaleAction = () => {
    setIsSaleModalOpen(true);
  };

  // ============================================
  // RENDER
  // ============================================
  const { data, loading, error, refetch } = currentView.dataHook;
  const ListComponent = currentView.RenderList as any;
  const ModalComponent = currentView.RenderModal as any;

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
          onSaleAction={handleSaleAction}
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
              items={activePanel === "vendedores" ? (data as Seller[]).filter(u => u.active !== false) : data}
              sales={data}
              ventas={data}
              clientes={data}
              sellers={activePanel === "vendedores" ? (data as Seller[]).filter(u => u.active !== false) : data}
              vendedores={activePanel === "vendedores" ? (data as Seller[]).filter(u => u.active !== false) : data}
              onDelete={handleDelete}
              onEdit={handleEdit} // Pasamos la función de editar
              onViewDetail={(id: number) => console.log(id)}
            />
          )}
        </div>
      </div>

      {/* Modal de Edición / Creación */}
      {ModalComponent && activePanel !== "ventas" && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          // Pasamos props específicas según el panel activo
          client={activePanel === "clientes" ? editingItem as any : undefined}
          product={activePanel === "stock" ? editingItem as any : undefined}
          user={activePanel === "vendedores" ? editingItem as any : undefined}
        />
      )}

      {/* Sale Modal (Standalone logic because it needs more props) */}
      <SaleModal
        isOpen={isSaleModalOpen || (activePanel === "ventas" && isModalOpen)}
        onClose={handleCloseModal}
        onSave={handleSaleSave}
        products={stockPanel.data as StockItem[]}
      />

      {/* Modal de Eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Eliminar ${activePanel === "clientes" ? "Cliente" : activePanel === "stock" ? "Producto" : "Registro"}`}
        description={`¿Estás seguro de que deseas eliminar este ${activePanel === "clientes" ? "cliente" : activePanel === "stock" ? "producto" : "registro"
          }? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}