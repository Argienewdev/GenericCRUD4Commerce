import { type Sale } from '../../types/dashboard.ts';

interface SaleCardProps {
  sale: Sale;
  onViewDetail?: (id: number) => void;
}

export function SaleCard({ sale, onViewDetail }: SaleCardProps) {
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
              Cliente: <span className="font-medium text-slate-800">{sale.client.name} {sale.client.surname}</span>
            </span>
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
        </div>
      </div>
    </div>
  );
}