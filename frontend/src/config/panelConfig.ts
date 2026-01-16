import { 
  Package, 
  DollarSign, 
  Users, 
  BarChart3, 
  UserCog, 
  type LucideIcon 
} from "lucide-react";
import { stockService } from "../services/stockService";
import { salesService } from "../services/salesService";
import { clientsService } from "../services/clientsService";
import { usersService } from "../services/usersService";
import type { StockItem, Sale, Client } from "../types/dashboard";
import type { UserInfo } from "../types/auth";

export type PanelType =
  | "stock"
  | "ventas"
  | "clientes"
  | "estadisticas"
  | "vendedores";

type PanelData = StockItem | Sale | Client | UserInfo;

export interface PanelConfig {
  id: PanelType;
  label: string;
  icon: LucideIcon;
  fetchData?: () => Promise<PanelData[]>;
  newButtonLabel?: string;
  searchPlaceholder?: string;
}

export const PANEL_CONFIG: Record<PanelType, PanelConfig> = {
  stock: {
    id: "stock",
    label: "Stock",
    icon: Package,
    fetchData: () => stockService.getStock(),
    newButtonLabel: "Nuevo Producto",
    searchPlaceholder: "Buscar producto...",
  },
  
  ventas: {
    id: "ventas",
    label: "Ventas",
    icon: DollarSign,
    fetchData: () => salesService.getSales(),
    newButtonLabel: "Nueva Venta",
    searchPlaceholder: "Buscar venta...",
  },
  
  clientes: {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    fetchData: () => clientsService.getClients(),
    newButtonLabel: "Nuevo Cliente",
    searchPlaceholder: "Buscar cliente...",
  },
  
  estadisticas: {
    id: "estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
  },
  
  vendedores: {
    id: "vendedores",
    label: "Vendedores",
    icon: UserCog,
    fetchData: () => usersService.getUsers(),
    newButtonLabel: "Nuevo Vendedor",
    searchPlaceholder: "Buscar vendedor...",
  },
};

export const getMenuItems = () => 
  Object.values(PANEL_CONFIG).map(({ id, label, icon }) => ({
    id,
    label,
    icon,
  }));