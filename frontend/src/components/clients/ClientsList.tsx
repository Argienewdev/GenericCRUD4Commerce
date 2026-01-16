import { type Client } from '../../types/dashboard.ts';
import { ClientCard } from './ClientCard.tsx';

interface ClientesListProps {
  clientes: Client[];
  onEdit?: (cliente: Client) => void;
  onDelete?: (id: number) => void;
}

export function ClientsList({ clientes, onEdit, onDelete }: ClientesListProps) {
  return (
    <div className="space-y-4">
      {clientes.map((cliente) => (
        <ClientCard 
          key={cliente.id} 
          cliente={cliente}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}