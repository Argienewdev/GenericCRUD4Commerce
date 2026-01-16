import type { Sale } from "../types/dashboard";
import { apiClient } from "./apiClient"

export const salesService = {
	getSales: async (): Promise<Sale[]> => {
		return apiClient.get<Sale[]>('/sales');
	}
}