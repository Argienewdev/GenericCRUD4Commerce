import { 
  Package, 
  DollarSign, 
  Users, 
  BarChart3, 
  UserCog, 
} from "lucide-react";
import { stockService } from "../services/stockService";
import { salesService } from "../services/salesService";
import { clientsService } from "../services/clientsService";
import { usersService } from "../services/usersService";
import type { StockItem, Sale, Client, MenuItem } from "../types/dashboard";
import type { UserInfo } from "../types/auth";

export type PanelType =
  | "stock"
  | "ventas"
  | "clientes"
  | "estadisticas"
  | "vendedores";

type PanelData = StockItem | Sale | Client | UserInfo;

export interface PanelConfig extends MenuItem {
  fetchData?: () => Promise<PanelData[]>;
  newButtonLabel?: string;
  searchPlaceholder?: string;
	pageTitle: string;
}

export const PANEL_CONFIG: Record<PanelType, PanelConfig> = {
  stock: {
    id: "stock",
    label: "Stock",
		pageTitle: "Gestión de Stock",
    icon: Package,
    fetchData: () => stockService.getStock(),
    newButtonLabel: "Nuevo Producto",
    searchPlaceholder: "Buscar producto...",
  },
  
  ventas: {
    id: "ventas",
    label: "Ventas",
		pageTitle: "Registro de Ventas",
    icon: DollarSign,
    fetchData: () => salesService.getSales(),
    newButtonLabel: "Nueva Venta",
    searchPlaceholder: "Buscar venta...",
  },
  
  clientes: {
    id: "clientes",
    label: "Clientes",
		pageTitle: "Cartera de Clientes",
    icon: Users,
    fetchData: () => clientsService.getClients(),
    newButtonLabel: "Nuevo Cliente",
    searchPlaceholder: "Buscar cliente...",
  },
  
  estadisticas: {
    id: "estadisticas",
    label: "Estadísticas",
		pageTitle: "Estadísticas Generales",
    icon: BarChart3,
  },
  
  vendedores: {
    id: "vendedores",
    label: "Vendedores",
		pageTitle: "Equipo de Ventas",
    icon: UserCog,
    fetchData: () => usersService.getUsers(),
    newButtonLabel: "Nuevo Vendedor",
    searchPlaceholder: "Buscar vendedor...",
  },
};

export const getMenuItems = (): MenuItem[] =>
  Object.values(PANEL_CONFIG).map(
    (item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
    }) as MenuItem
  );
 