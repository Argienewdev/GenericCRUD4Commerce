import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { type Role } from "../../types/auth";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: Role;
}

export function ProtectedComponent({
	children,
	requiredRole,
}: ProtectedRouteProps) {
	const { loading, isAuthenticated, hasRole } = useAuth();

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
		return null;
	}

	return <>{children}</>;
}