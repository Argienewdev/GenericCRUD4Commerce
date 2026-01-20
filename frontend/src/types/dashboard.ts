import { type LucideIcon } from "lucide-react";
import type { PanelType } from "../config/panelConfig";

export interface StockItem {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
}

export interface MenuItem {
	id: PanelType;
	label: string;
	icon: LucideIcon;
}

export interface Sale {
	id: number;
	total: number;
	date: string;
	client: string;
	products: number;
	seller: string;
}

export interface Client {
	id: number;
	name: string;
	surname: string;
	dni: number;
	phone_number: string;
	address: string;
}

export interface StatCard {
	title: string;
	value: string;
	change: string;
	isPositive: boolean;
	icon: LucideIcon;
	color: "green" | "red" | "blue";
}

export interface Seller {
	id: number;
	name: string;
	email: string;
	role: string;
	sales: number;
}
