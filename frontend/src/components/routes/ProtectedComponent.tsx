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
	const { isAuthenticated, hasRole } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && !hasRole(requiredRole)) {
		return null;
	}

	return <>{children}</>;
}