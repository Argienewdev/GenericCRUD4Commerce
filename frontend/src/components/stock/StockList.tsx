// components/stock/StockList.tsx

import { type StockItem } from '../../types/dashboard.ts';
import { StockCard } from './StockCard.tsx';

interface StockListProps {
  items: StockItem[];
  onEdit?: (item: StockItem) => void;
  onDelete?: (id: number) => void;
}

export function StockList({ items, onEdit, onDelete }: StockListProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option>Todos los productos</option>
          <option>Con stock</option>
          <option>Sin stock</option>
        </select>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option>Ordenar por fecha</option>
          <option>Precio: menor a mayor</option>
          <option>Precio: mayor a menor</option>
        </select>
      </div>

      {/* Items */}
      {items.map((item) => (
        <StockCard 
          key={item.id} 
          item={item} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}