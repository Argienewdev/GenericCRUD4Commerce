import { useState } from "react";
import { SalesList } from "../../components/sales/SalesList";
import { SaleModal } from "../../components/modals/SaleModal";
import { salesService } from "../../services/salesService";
import type { Sale, StockItem, SaleDTO } from "../../types/dashboard";
import { Spinner } from "../../utils/Spinner";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { usePanel } from "../../hooks/usePanel";

export function SalesPanel() {
  const { data, loading, error, refetch } = usePanel<Sale>("ventas");
  const { data: products, loading: loadingProducts } = usePanel<StockItem>("stock");
  
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [showError, setShowError] = useState(true);

  if (loading || loadingProducts) return <Spinner />;

  const handleSaveSale = async (saleData: SaleDTO) => {
    await salesService.createSale(saleData);
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Botón de Nueva Venta */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSaleModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
        >
          Nueva Venta
        </button>
      </div>

      {/* Lista de ventas */}
      <SalesList
        sales={data}
        onViewDetail={(id) => {
          console.log("Ver detalle de venta:", id);
          // Aquí podrías implementar la navegación o abrir un modal de detalle
        }}
        onDelete={async (id) => {
          await salesService.deleteSale(id);
          await refetch();
        }}
      />

      {/* Modal de Nueva Venta */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSave={handleSaveSale}
        products={products}
      />

      {/* Modal de error */}
      <ErrorModal
        isOpen={!!error && showError}
        onClose={() => setShowError(false)}
        message={error ?? ""}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
      />
    </div>
  );
}