import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { type Role } from "../../types/auth";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: Role;
}

export function ProtectedRoute({
	children,
	requiredRole,
}: ProtectedRouteProps) {
	const { user, loading, isAuthenticated, hasRole } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && !hasRole(requiredRole)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="bg-white p-8 rounded-xl shadow-lg text-center">
					<div className="text-red-500 text-6xl mb-4">🚫</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Acceso Denegado
					</h2>
					<p className="text-gray-600 mb-4">
						No tienes permisos para acceder a esta sección
					</p>
					<p className="text-sm text-gray-500">
						Tu rol actual: <span className="font-semibold">{user?.role}</span>
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
