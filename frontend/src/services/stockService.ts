import type { StockItem } from "../types/dashboard"
import { apiClient } from "./apiClient"

export const stockService = {
	getStock: async () : Promise<StockItem[]> => {
		return apiClient.get<StockItem[]>('/products');
	},
}