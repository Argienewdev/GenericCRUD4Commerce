import { type UserInfo, type CreateUserRequest } from "../types/auth";
import { apiClient } from "./apiClient"

export const usersService = {
	getUsers: async (): Promise<UserInfo[]> => {
    return apiClient.get<UserInfo[]>('/users');
  },

  createUser: async (data: CreateUserRequest): Promise<UserInfo> => {
    return apiClient.post<UserInfo>('/users', data);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}`);
  },

  updateUser: async (id: number, data: CreateUserRequest): Promise<UserInfo> => {
    return apiClient.put<UserInfo>(`/users/${id}`, data);
  }
}