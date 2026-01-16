import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  ApiResponse,
} from "../types/auth";

/**
 * Auth Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Authenticate user with credentials
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>("/auth/logout");
  },

  /**
   * Fetch authenticated user information
   */
  me: async (): Promise<MeResponse> => {
    return apiClient.get<MeResponse>("/auth/me");
  },
};