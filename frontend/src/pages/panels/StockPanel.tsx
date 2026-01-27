import { useState } from "react";
import { usePanel } from "../../hooks/usePanel";
import { StockList } from "../../components/stock/StockList";
import { stockService } from "../../services/stockService";
import type { StockItem } from "../../types/dashboard";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { Spinner } from "../../utils/Spinner";

export function StockPanel() {
  const { data, loading, error, refetch } = usePanel<StockItem>("stock");

  const [showError, setShowError] = useState(true);

  if (loading) return <Spinner />;

  return (
    <>
      <StockList
        items={data}
        onDelete={async (id) => {
          await stockService.deleteProduct(id);
          refetch();
        }}
      />

      <ErrorModal
        isOpen={!!error && showError}
        onClose={() => setShowError(false)}
        message={error ?? ""}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
      />
    </>
  );
}
