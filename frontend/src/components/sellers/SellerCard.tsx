import { Edit2, Trash2 } from "lucide-react";
import { type Seller } from "../../types/dashboard.ts";

interface SellerCardProps {
	seller: Seller;
	onEdit?: (seller: Seller) => void;
	onDelete?: (id: number) => void;
}

export function SellerCard({
	seller,
	onEdit,
	onDelete,
}: SellerCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
						{seller.name.charAt(0)}
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-slate-800">
							{seller.name}
						</h3>
						<p className="text-slate-600 text-sm">{seller.email}</p>
						<div className="flex gap-4 mt-2">
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium ${seller.role === "Admin"
										? "bg-amber-100 text-amber-700"
										: "bg-blue-100 text-blue-700"
									}`}
							>
								{seller.role}
							</span>
							<span className="text-sm text-slate-500">
								{seller.sales} ventas realizadas
							</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => onEdit?.(seller)}
						className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
					>
						<Edit2 size={20} />
					</button>
					<button
						onClick={() => onDelete?.(seller.id)}
						className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
					>
						<Trash2 size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
