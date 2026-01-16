import axios, {
	type AxiosInstance,
	type AxiosError,
	type AxiosResponse,
	type AxiosRequestConfig,
} from "axios";
import type { ApiResponse } from "../types/auth";

// TODO: update the url using .env variable
const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface ApiError {
	status?: number;
	message: string;
}

const createAxiosInstance = (): AxiosInstance => {
	const instance = axios.create({
		baseURL: API_BASE_URL,
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Request interceptor
	instance.interceptors.request.use(
		(config) => {
			console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
			return config;
		},
		(error) => {
			console.error("[API] Request error:", error);
			return Promise.reject(error);
		}
	);

	// Response interceptor
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			console.log(`[API] ${response.status} ${response.config.url}`);
			return response;
		},
		(error: AxiosError<ApiResponse>) => {
			const status = error.response?.status;
			const message =
				error.response?.data?.message ||
				error.message ||
				"Unexpected API error";

			console.error("[API] Response error:", status, message);

			// Global 401 handling
			if (status === 401) {
				// window.location.href = "/login";
				// or dispatch logout event
			}

			const apiError: ApiError = { status, message };
			return Promise.reject(apiError);
		}
	);

	return instance;
};

const axiosInstance = createAxiosInstance();

export const apiClient = {
	/**
	 * Get the raw axios instance
	 */
	getInstance: () => axiosInstance,

	/**
	 * Generic GET request
	 */
	get: <T>(path: string, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.get<T>(path, config).then((res) => res.data),

	/**
	 * Generic POST request
	 */
	post: <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.post<T>(path, data, config).then((res) => res.data),

	/**
	 * Generic PUT request
	 */
	put: <T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.put<T>(path, data, config).then((res) => res.data),

	/**
	 * Generic DELETE request
	 */
	delete: <T>(path: string, config?: AxiosRequestConfig): Promise<T> =>
		axiosInstance.delete<T>(path, config).then((res) => res.data),
};
