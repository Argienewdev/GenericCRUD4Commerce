import { Edit2, Trash2 } from 'lucide-react';
import { type StockItem } from '../../types/dashboard.ts';

interface StockCardProps {
  item: StockItem;
  onEdit?: (item: StockItem) => void;
  onDelete?: (id: number) => void;
}

export function StockCard({ item, onEdit, onDelete }: StockCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
          <p className="text-slate-600 mt-1 wrap-break-word">{item.description}</p>
          <div className="flex items-center gap-6 mt-4">
            <span className="text-2xl font-bold text-blue-600">
              ${item.price.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">
              Stock: <span className="font-semibold text-slate-700">{item.stock} unidades</span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onDelete?.(item.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}