import { type Sale } from '../../types/dashboard.ts';
import { SaleCard } from './SaleCard.tsx'

interface SalesListProps {
  sales: Sale[];
  onViewDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function SalesList({ sales, onViewDetail, onDelete }: SalesListProps) {
  return (
    <div className="space-y-4">
      {/* Date Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="date"
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <span className="flex items-center text-slate-500">hasta</span>
        <input
          type="date"
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Ventas */}
      {Array.isArray(sales) ? (
        sales.map((sale) => (
          <SaleCard
            key={sale.id}
            sale={sale}
            onViewDetail={onViewDetail}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center py-10 text-slate-500 italic">
          No hay ventas para mostrar
        </div>
      )}
    </div>
  );
}