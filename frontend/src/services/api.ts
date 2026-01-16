import axios, { type AxiosInstance, AxiosError } from 'axios';
import { type LoginRequest, type LoginResponse, type MeResponse, type ApiResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Automatically sends cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Logging interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Error handling interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        console.error('[API] Response error:', error.response?.status, error.response?.data);
        
        const message = error.response?.data?.message || error.message || 'Error en la petición';
        
        return Promise.reject(new Error(message));
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/auth/logout');
    return response.data;
  }

  async me(): Promise<MeResponse> {
    const response = await this.client.get<MeResponse>('/auth/me');
    return response.data;
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const api = new ApiClient();