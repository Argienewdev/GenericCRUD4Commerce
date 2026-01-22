import type { UserInfo } from "../types/auth";
import { apiClient } from "./apiClient"

export const usersService = {
	getUsers: async (): Promise<UserInfo[]> => {
    return apiClient.get<UserInfo[]>('/users');
  },

  createUser: async (data: any): Promise<UserInfo> => {
    return apiClient.post<UserInfo>('/users', data);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}`);
  }
}