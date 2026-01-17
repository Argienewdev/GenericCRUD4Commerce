import { type Sale } from '../../types/dashboard.ts';
import { SaleCard } from './SaleCard.tsx'

interface SalesListProps {
  sales: Sale[];
  onViewDetail?: (id: number) => void;
}

export function SalesList({ sales, onViewDetail }: SalesListProps) {
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
      {sales.map((sale) => (
        <SaleCard
          key={sale.id}
          sale={sale}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}