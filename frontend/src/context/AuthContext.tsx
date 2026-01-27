import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserInfo, type LoginRequest, type Role } from '../types/auth';
import { authService } from '../services/authService';
import { Spinner } from '../utils/Spinner';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await authService.me();
      setUser(response.user);
    } catch (error) {
      console.log("Error inesperado al obtener datos del usuario: ", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    
    if (!response.success || !response.user) {
      throw new Error(response.message);
    }

    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user !== null,
    hasRole,
  };

  if (loading) return <Spinner fullScreen/>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}