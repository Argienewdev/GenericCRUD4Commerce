import { type Vendedor } from '../../types/dashboard';
import { SellerCard } from './SellerCard';

interface VendedoresListProps {
  vendedores: Vendedor[];
  onEdit?: (vendedor: Vendedor) => void;
  onDelete?: (id: number) => void;
}

export function SellersList({ vendedores, onEdit, onDelete }: VendedoresListProps) {
  return (
    <div className="space-y-4">
      {vendedores.map((vendedor) => (
        <SellerCard 
          key={vendedor.id} 
          vendedor={vendedor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}