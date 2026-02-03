import { useState } from "react";
import { StockList } from "../../components/stock/StockList";
import { ProductModal } from "../../components/modals/ProductModal";
import { stockService } from "../../services/stockService";
import type { StockItem } from "../../types/dashboard";
import { Spinner } from "../../utils/Spinner";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { usePanel } from "../../hooks/usePanel";
import { DeleteConfirmationModal } from "../../components/modals/DeleteConfirmationModal";

export function StockPanel() {
  const { data, loading, error, refetch } = usePanel<StockItem>("stock");

  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Create/Edit
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //Delete confirmation

  if (loading) return <Spinner />;

  const handleSave = async (productData: Omit<StockItem, "id">, id?: number) => {
    if (id) {
      await stockService.updateProduct(id, productData);
    } else {
      await stockService.createProduct(productData);
    }
    await refetch();
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleteError(null);
      await stockService.deleteProduct(id);
      await refetch();
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err: unknown) {
      console.error("Error deleting product:", err);
      const apiError = err as { status?: number; message?: string };
      if (apiError.status === 409){
        setDeleteError("No se pudo eliminar el producto debido a que alguna vez fue vendido.");
      }else{
        setDeleteError(apiError.message || "No se pudo eliminar el producto");
      }
      setShowError(true);
    }
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
      </div>

      {/* Lista de productos */}
      <StockList
        items={data}
        onEdit={(product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          const product = data.find(p => p.id === id);
          if (product) {
            setSelectedProduct(product);
            setIsDeleteModalOpen(true);
          }
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
        isOpen={(!!error || !!deleteError) && showError}
        onClose={() => {
          setShowError(false);
          setDeleteError(null);
        }}
        message={deleteError || error || ""}
        onRetry={() => {
          setShowError(false);
          setDeleteError(null);
          refetch();
        }}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={async () => {
          if (selectedProduct) {
            await handleDelete(selectedProduct.id);
          }
        }}
        title="Eliminar Producto"
        description={`¿Estás seguro de que deseas eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer y el producto será removido permanentemente del inventario.`}
      />
    </div>
  );
}
