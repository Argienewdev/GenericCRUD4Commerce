import type { Client } from "../types/dashboard";
import { apiClient } from "./apiClient"

export const clientsService = {
	getClients: async (): Promise<Client[]> => {
		return apiClient.get<Client[]>('/clients');
	}
}