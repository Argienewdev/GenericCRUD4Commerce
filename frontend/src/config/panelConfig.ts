import {
  Package,
  DollarSign,
  Users,
  BarChart3,
  UserCog,
} from "lucide-react";
import type { Client, MenuItem, Sale, StockItem } from "../types/dashboard";
import { StockPanel } from "../pages/panels/StockPanel";
import { SalesPanel } from "../pages/panels/SalesPanel";
import { ClientsPanel } from "../pages/panels/ClientsPanel";
import { UsersPanel } from "../pages/panels/UsersPanel";
import { StatsPanel } from "../pages/panels/StatsPanel";
import { stockService } from "../services/stockService";
import { salesService } from "../services/salesService";
import { clientsService } from "../services/clientsService";
import { usersService } from "../services/usersService";
import type { UserInfo } from "../types/auth";

export type PanelType =
  | "stock"
  | "ventas"
  | "clientes"
  | "estadisticas"
  | "usuarios";

type PanelData = StockItem | Sale | Client | UserInfo;

export interface PanelConfig extends MenuItem {
  pageTitle: string;
  Component: React.ComponentType;
	fetchData?: () => Promise<PanelData[]>
}

export const PANEL_CONFIG: Record<PanelType, PanelConfig> = {
  stock: {
    id: "stock",
    label: "Stock",
    icon: Package,
    pageTitle: "Gestión de Stock",
    Component: StockPanel,
		fetchData: () => stockService.getStock(),
  },

  ventas: {
    id: "ventas",
    label: "Ventas",
    icon: DollarSign,
    pageTitle: "Registro de Ventas",
    Component: SalesPanel,
		fetchData: () => salesService.getSales(),
  },

  clientes: {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    pageTitle: "Cartera de Clientes",
    Component: ClientsPanel,
		fetchData: () => clientsService.getClients(),
  },

  estadisticas: {
    id: "estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
    pageTitle: "Estadísticas Generales",
    Component: StatsPanel,
  },

  usuarios: {
    id: "usuarios",
    label: "Usuarios",
    icon: UserCog,
    pageTitle: "Equipo",
    Component: UsersPanel,
		fetchData: () => usersService.getUsers(),
  },
};

export const getMenuItems = (): MenuItem[] =>
  Object.values(PANEL_CONFIG).map(({ id, label, icon }) => ({
    id,
    label,
    icon,
  }));
