import { type Sale } from '../../types/dashboard';
import { Trash2 } from 'lucide-react';

interface SaleCardProps {
  sale: Sale;
  onViewDetail?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function SaleCard({ sale, onViewDetail, onDelete }: SaleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Venta #{sale.id.toString().padStart(3, '0')}
            </h3>
            <span className="text-2xl font-bold text-green-600">
              ${sale.total.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-6 mt-3 text-sm text-slate-600">
            <span>
              Vendedor: <span className="font-medium text-slate-800">{sale.seller.username}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-slate-500">{sale.date}</span>
          <button
            onClick={() => onViewDetail?.(sale.id)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver detalle →
          </button>
          <button
            onClick={() => onDelete?.(sale.id)}
            className="text-red-400 hover:text-red-600 transition-colors p-1"
            title="Eliminar venta"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}