import { usePanel } from "../../hooks/usePanel";
import { StockList } from "../../components/stock/StockList";
import { stockService } from "../../services/stockService";
import type { StockItem } from "../../types/dashboard";
import { Spinner } from "../../utils/Spinner";

export function StockPanel() {
  const { data, loading, error, refetch } = usePanel<StockItem>("stock");

  if (loading) return <Spinner />;
  if (error) return <div>Error</div>;

  return (
    <StockList
      items={data}
      onDelete={async (id) => {
        await stockService.deleteProduct(id);
        refetch();
      }}
    />
  );
}
