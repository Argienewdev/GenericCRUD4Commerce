import type { Client } from "../types/dashboard";
import { apiClient } from "./apiClient"

export const clientsService = {

	getClients: async (): Promise<Client[]> => {
    return apiClient.get<Client[]>('/clients');
  },

  createClient: async (data: Omit<Client, 'id'>): Promise<Client> => {
    return apiClient.post<Client>('/clients', data);
  },

  deleteClient: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/clients/${id}`);
  },
  
  updateClient: async (id: number, data: Partial<Client>): Promise<Client> => {
    return apiClient.put<Client>(`/clients/${id}`, data);
  }
}