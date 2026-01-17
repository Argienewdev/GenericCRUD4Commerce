import type { StockItem } from "../types/dashboard"
import { apiClient } from "./apiClient"

export const stockService = {

  getStock: async (): Promise<StockItem[]> => {
    return apiClient.get<StockItem[]>('/products');
  },
  
  createProduct: async (data: Omit<StockItem, 'id'>): Promise<StockItem> => {
    return apiClient.post<StockItem>('/products', data);
  },

  deleteProduct: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/products/${id}`);
  },

  updateProduct: async (id: number, data: Partial<StockItem>): Promise<StockItem> => {
    return apiClient.put<StockItem>(`/products/${id}`, data);
  }
}