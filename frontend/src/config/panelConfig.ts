import {
  Package,
  DollarSign,
  Users,
  BarChart3,
  UserCog,
} from "lucide-react";
import type { MenuItem } from "../types/dashboard";
import { StockPanel } from "../pages/panels/StockPanel";
import { SalesPanel } from "../pages/panels/SalesPanel";
import { ClientsPanel } from "../pages/panels/ClientsPanel";
import { SellersPanel } from "../pages/panels/SellersPanel";
import { StatsPanel } from "../pages/panels/StatsPanel";
import { stockService } from "../services/stockService";
import { salesService } from "../services/salesService";
import { clientsService } from "../services/clientsService";
import { usersService } from "../services/usersService";
import { ProductModal } from "../components/modals/ProductModal";
import { ClientModal } from "../components/modals/ClientModal";

export type PanelType =
  | "stock"
  | "ventas"
  | "clientes"
  | "estadisticas"
  | "vendedores";

export interface PanelConfig extends MenuItem {
  pageTitle: string;
  searchPlaceholder: string;
  newButtonLabel?: string;
  showSaleButton: boolean;
  Component: React.ComponentType;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fetchData?: () => Promise<any[]>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Modal?: React.ComponentType<any>;
}

export const PANEL_CONFIG: Record<PanelType, PanelConfig> = {
  stock: {
    id: "stock",
    label: "Stock",
    icon: Package,
    pageTitle: "Gestión de Stock",
    searchPlaceholder: "Buscar producto...",
    newButtonLabel: "Nuevo Producto",
    showSaleButton: true,
    Component: StockPanel,
		fetchData: () => stockService.getStock(),
		Modal: ProductModal,
  },

  ventas: {
    id: "ventas",
    label: "Ventas",
    icon: DollarSign,
    pageTitle: "Registro de Ventas",
    searchPlaceholder: "Buscar venta...",
    newButtonLabel: "Nueva Venta",
    showSaleButton: false,
    Component: SalesPanel,
		fetchData: () => salesService.getSales(),
  },

  clientes: {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    pageTitle: "Cartera de Clientes",
    searchPlaceholder: "Buscar cliente...",
    newButtonLabel: "Nuevo Cliente",
    showSaleButton: false,
    Component: ClientsPanel,
		fetchData: () => clientsService.getClients(),
		Modal: ClientModal,
  },

  estadisticas: {
    id: "estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
    pageTitle: "Estadísticas Generales",
    searchPlaceholder: "",
    showSaleButton: false,
    Component: StatsPanel,
  },

  vendedores: {
    id: "vendedores",
    label: "Vendedores",
    icon: UserCog,
    pageTitle: "Equipo de Ventas",
    searchPlaceholder: "Buscar vendedor...",
    newButtonLabel: "Nuevo Vendedor",
    showSaleButton: false,
    Component: SellersPanel,
		fetchData: () => usersService.getUsers(),
  },
};

export const getMenuItems = (): MenuItem[] =>
  Object.values(PANEL_CONFIG).map(({ id, label, icon }) => ({
    id,
    label,
    icon,
  }));
