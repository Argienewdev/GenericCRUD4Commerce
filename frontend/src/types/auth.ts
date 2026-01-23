export const Role = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface UserInfo {
  id: number;
  username: string;
  role: Role;
  active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserInfo | null;
}

export interface MeResponse {
  user: UserInfo;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}