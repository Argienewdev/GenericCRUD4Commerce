import type { UserInfo } from "../types/auth";
import { apiClient } from "./apiClient"

export const usersService = {
	getUsers: async (): Promise<UserInfo[]> => {
		return apiClient.get<UserInfo[]>('/seller');
	}
}