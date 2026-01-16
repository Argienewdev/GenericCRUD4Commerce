import { type LucideIcon } from "lucide-react";

export interface StockItem {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
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
	dni: string;
	mobile_phone: string;
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
