import { type Seller } from '../../types/dashboard';
import { SellerCard } from './SellerCard';

interface SellersListProps {
  sellers: Seller[];
  onEdit?: (seller: Seller) => void;
  onDelete?: (id: number) => void;
}

export function SellersList({ sellers, onEdit, onDelete }: SellersListProps) {
  return (
    <div className="space-y-4">
      {sellers.filter(seller => seller.active !== false).map((seller) => (
        <SellerCard
          key={seller.id}
          seller={seller}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}