import { LucideIcon } from 'lucide-react';

export type PanelType = 'stock' | 'ventas' | 'clientes' | 'estadisticas' | 'vendedores';

export interface MenuItem {
  id: PanelType;
  label: string;
  icon: LucideIcon;
}

export interface StockItem {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Venta {
  id: number;
  total: number;
  date: string;
  client: string;
  productos: number;
  vendedor: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  domicilio: string;
}

export interface Vendedor {
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'Usuario';
  ventas: number;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
}