import { type Sale } from '../../types/dashboard.ts';

interface VentaCardProps {
  venta: Sale;
  onViewDetail?: (id: number) => void;
}

export function SaleCard({ venta, onViewDetail }: VentaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Venta #{venta.id.toString().padStart(3, '0')}
            </h3>
            <span className="text-2xl font-bold text-green-600">
              ${venta.total.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-6 mt-3 text-sm text-slate-600">
            <span>
              Cliente: <span className="font-medium text-slate-800">{venta.client}</span>
            </span>
            <span>
              Productos: <span className="font-medium text-slate-800">{venta.products}</span>
            </span>
            <span>
              Vendedor: <span className="font-medium text-slate-800">{venta.seller}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-slate-500">{venta.date}</span>
          <button 
            onClick={() => onViewDetail?.(venta.id)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver detalle →
          </button>
        </div>
      </div>
    </div>
  );
}