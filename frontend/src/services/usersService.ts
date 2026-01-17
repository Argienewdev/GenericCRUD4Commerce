import type { UserInfo } from "../types/auth";
import { apiClient } from "./apiClient"

export const usersService = {
	getUsers: async (): Promise<UserInfo[]> => {
    return apiClient.get<UserInfo[]>('/sellers');
  },

  createUser: async (data: any): Promise<UserInfo> => {
    return apiClient.post<UserInfo>('/sellers', data);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/sellers/${id}`);
  }
}