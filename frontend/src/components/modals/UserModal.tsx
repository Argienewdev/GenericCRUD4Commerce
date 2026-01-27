import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Role, type UserInfo, type CreateUserRequest } from "../../types/auth";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: CreateUserRequest) => Promise<void>;
  user?: UserInfo; // Optional prop for editing
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: Role.VENDEDOR as Role,
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          username: user.username,
          password: "", // Keep password empty when editing
          role: user.role,
        });
      } else {
        setFormData({
          username: "",
          password: "",
          role: Role.VENDEDOR,
        });
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      setFormData({ username: "", password: "", role: Role.VENDEDOR });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {user ? "Editar Vendedor" : "Nuevo Vendedor"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: juan_perez"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {user ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
            </label>
            <input
              required={!user}
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
            >
              <option value={Role.VENDEDOR}>Vendedor</option>
              <option value={Role.ADMIN}>Administrador</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : (user ? "Guardar Cambios" : "Guardar Vendedor")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
