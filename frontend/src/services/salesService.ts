import type { Sale, SaleDTO } from "../types/dashboard";
import { apiClient } from "./apiClient"

export const salesService = {

	getSales: async (): Promise<Sale[]> => {
    return apiClient.get<Sale[]>('/sales');
  },

  createSale: async (data: SaleDTO): Promise<Sale> => {
    return apiClient.post<Sale>('/sales', data);
  },
  
  deleteSale: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/sales/${id}`);
  }
}