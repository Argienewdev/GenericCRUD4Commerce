import { type Sale } from '../../types/dashboard.ts';
import { SaleCard } from './SaleCard.tsx'

interface VentasListProps {
  ventas: Sale[];
  onViewDetail?: (id: number) => void;
}

export function SalesList({ ventas, onViewDetail }: VentasListProps) {
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
      {ventas.map((venta) => (
        <SaleCard 
          key={venta.id} 
          venta={venta}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}