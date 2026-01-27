import { useState } from "react";
import { StockList } from "../../components/stock/StockList";
import { ProductModal } from "../../components/modals/ProductModal";
import { stockService } from "../../services/stockService";
import type { StockItem } from "../../types/dashboard";
import { Spinner } from "../../utils/Spinner";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { usePanel } from "../../hooks/usePanel";

export function StockPanel() {
  const { data, loading, error, refetch } = usePanel<StockItem>("stock");

  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(true);

  if (loading) return <Spinner />;

  const handleSave = async (productData: Omit<StockItem, "id">, id?: number) => {
    if (id) {
      await stockService.updateProduct(id, productData);
    } else {
      await stockService.createProduct(productData);
    }
    await refetch();
  };

  return (
    <div className="space-y-6">

      {/* Botones del panel */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Nuevo Producto
        </button>

        <button
          onClick={() => console.log("Abrir modal de Nueva Venta")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95"
        >
          Nueva Venta
        </button>
      </div>

      {/* Lista de productos */}
      <StockList
        items={data}
        onEdit={(product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }}
        onDelete={async (id) => {
          await stockService.deleteProduct(id);
          await refetch();
        }}
      />

      {/* Modal de creación / edición */}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={(data) => handleSave(data, selectedProduct?.id)}
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
