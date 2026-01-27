import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type UserInfo, type LoginRequest, type Role } from '../types/auth';
import { authService } from '../services/authService';
import { Spinner } from '../utils/Spinner';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  clearError: () => void;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.me();
      setUser(response.user);
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : "Error inesperado al verificar autenticación";
      
      console.error("Failed to fetch user data:", error);
      setError(message);
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
    setError(null);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const clearError = () => {
    setError(null);
  };

  const retryAuth = async () => {
    await checkAuth();
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: user !== null,
    hasRole,
    clearError,
    retryAuth,
  };

  // Show loading spinner during initial auth check
  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Global error modal for authentication failures */}
      {/* TODO
			<ErrorModal
        isOpen={!!error}
        onClose={clearError}
        title="Error de Autenticación"
        message={error || ""}
        onRetry={retryAuth}
        retryLabel="Reintentar"
      />*/}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}