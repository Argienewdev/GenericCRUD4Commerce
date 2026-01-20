import { Edit2, Trash2 } from "lucide-react";
import { type Client } from "../../types/dashboard";

interface ClienteCardProps {
	cliente: Client;
	onEdit?: (cliente: Client) => void;
	onDelete?: (id: number) => void;
}

export function ClientCard({ cliente, onEdit, onDelete }: ClienteCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-slate-800">
						{cliente.name} {cliente.surname}
					</h3>
					<div className="grid grid-cols-3 gap-4 mt-3 text-sm">
						<div>
							<p className="text-slate-500">DNI</p>
							<p className="font-medium text-slate-800">{cliente.dni}</p>
						</div>
						<div>
							<p className="text-slate-500">Teléfono</p>
							<p className="font-medium text-slate-800">{cliente.phoneNumber}</p>
						</div>
						<div>
							<p className="text-slate-500">Domicilio</p>
							<p className="font-medium text-slate-800">{cliente.address}</p>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => onEdit?.(cliente)}
						className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
					>
						<Edit2 size={20} />
					</button>
					<button
						onClick={() => onDelete?.(cliente.id)}
						className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
					>
						<Trash2 size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
