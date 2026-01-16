import { useEffect, useState } from "react";
import { Package, DollarSign, Users, BarChart3, UserCog } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { StockList } from "../components/stock/StockList";
import { type Client, type MenuItem, type PanelType, type Sale, type StockItem } from "../types/dashboard";
import { SalesList } from "../components/sales/SalesList";
import { ClientsList } from "../components/clients/ClientsList";
import { StatsPanel } from "../components/stats/StatsPanel";
import { SellersList } from "../components/sellers/SellersList";
import { stockService } from "../services/stockService";
import type { UserInfo } from "../types/auth";

const menuItems: MenuItem[] = [
	{ id: "stock", label: "Stock", icon: Package },
	{ id: "ventas", label: "Ventas", icon: DollarSign },
	{ id: "clientes", label: "Clientes", icon: Users },
	{ id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
	{ id: "vendedores", label: "Vendedores", icon: UserCog },
];

export function Dashboard() {
	const [activePanel, setActivePanel] = useState<PanelType>("stock");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [stockItems, setStockItems] = useState<StockItem[]>([]);
	const [sales] = useState<Sale[]>([]);
	const [clients] = useState<Client[]>([]);
	const [sellers] = useState<UserInfo[]>([]);

	useEffect(() => {
		const fetchStock = async () => {
			try {
				const data = await stockService.getStock();
				setStockItems(data);
			} catch (error) {
				console.error("Failed to fetch stock", error);
			}
  	};

  	fetchStock();
	}, [])

	// Handlers
	const handleNewAction = () => {
		console.log(`Crear nuevo ${activePanel}`);
		// Aquí irá la lógica para abrir modales de creación
	};

	const handleEdit = (item: unknown) => {
		console.log("Editar:", item);
		// Aquí irá la lógica para editar
	};

	const handleDelete = (id: number) => {
		console.log("Eliminar:", id);
		// Aquí irá la lógica para eliminar
	};

	const handleViewDetail = (id: number) => {
		console.log("Ver detalle:", id);
		// Aquí irá la lógica para ver detalles
	};

	// Render Content based on active panel
	const renderContent = () => {
		switch (activePanel) {
			case "stock":
				return (
					<StockList
						items={stockItems}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				);

			case "ventas":
				return (
					<SalesList ventas={sales} onViewDetail={handleViewDetail} />
				);

			case "clientes":
				return (
					<ClientsList
						clientes={clients}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				);

			case "estadisticas":
				return <StatsPanel />;

			case "vendedores":
				return (
					<SellersList
						vendedores={sellers}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<div className="flex h-screen bg-slate-50">
			{/* Sidebar */}
			<Sidebar
				isOpen={sidebarOpen}
				activePanel={activePanel}
				menuItems={menuItems}
				onPanelChange={setActivePanel}
			/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<Header
					activePanel={activePanel}
					sidebarOpen={sidebarOpen}
					onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
					onNewAction={handleNewAction}
				/>

				{/* Content Area */}
				<div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
			</div>
		</div>
	);
}
