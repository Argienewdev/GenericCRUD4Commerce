import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Role } from "../types/auth";

export function DashboardPage() {
	const { user, logout, hasRole } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Sistema de Gestión de Stock
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							Bienvenido,{" "}
							<span className="font-semibold">{user?.username}</span>
							{" - "}
							<span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
								{user?.role}
							</span>
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
					>
						Cerrar Sesión
					</button>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-800">
								Consultar Stock
							</h3>
							<span className="text-3xl">📦</span>
						</div>
						<p className="text-gray-600 text-sm mb-4">
							Ver inventario disponible y buscar productos
						</p>
						<button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
							Ir a Stock
						</button>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-800">
								Realizar Venta
							</h3>
							<span className="text-3xl">💰</span>
						</div>
						<p className="text-gray-600 text-sm mb-4">
							Procesar ventas y generar tickets
						</p>
						<button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
							Nueva Venta
						</button>
					</div>

					{hasRole(Role.ADMIN) && (
						<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-2 border-purple-200">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-800">
									Gestión de Productos
								</h3>
								<span className="text-3xl">🏷️</span>
							</div>
							<p className="text-gray-600 text-sm mb-4">
								Agregar, editar o eliminar productos
							</p>
							<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
								Gestionar Productos
							</button>
						</div>
					)}

					{hasRole(Role.ADMIN) && (
						<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-2 border-orange-200">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-800">
									Gestión de Usuarios
								</h3>
								<span className="text-3xl">👥</span>
							</div>
							<p className="text-gray-600 text-sm mb-4">
								Crear, editar o desactivar vendedores
							</p>
							<button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition">
								Gestionar Usuarios
							</button>
						</div>
					)}

					{hasRole(Role.ADMIN) && (
						<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-2 border-blue-200">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-800">
									Reportes
								</h3>
								<span className="text-3xl">📊</span>
							</div>
							<p className="text-gray-600 text-sm mb-4">
								Ver estadísticas y análisis de ventas
							</p>
							<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
								Ver Reportes
							</button>
						</div>
					)}
				</div>

				<div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
					<p className="text-sm text-indigo-800">
						<span className="font-semibold">💡 Tip:</span>
						{hasRole(Role.ADMIN)
							? " Como administrador, tienes acceso completo a todas las funcionalidades del sistema."
							: " Como vendedor, puedes consultar stock y realizar ventas. Contacta a un administrador para más permisos."}
					</p>
				</div>
			</main>
		</div>
	);
}
