import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Client } from "../../types/dashboard";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, "id">) => Promise<void>;
  client?: Client; // Optional prop for editing
}

export function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    address: "",
    dni: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (client) {
        setFormData({
          name: client.name,
          surname: client.surname,
          address: client.address,
          dni: client.dni.toString(),
          phoneNumber: client.phoneNumber,
        });
      } else {
        setFormData({
          name: "",
          surname: "",
          address: "",
          dni: "",
          phoneNumber: "",
        });
      }
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        name: formData.name,
        surname: formData.surname,
        address: formData.address,
        dni: parseInt(formData.dni),
        phoneNumber: formData.phoneNumber,
      });
      
      // Clean form and close
      setFormData({ name: "", surname: "", address: "", dni: "", phoneNumber: "" });
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
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Juan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Pérez"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI (Sin puntos)</label>
            <input
              required
              type="text"
              inputMode="numeric"
              readOnly={!!client}
              className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                client ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
              }`}
              placeholder="Ej: 30123456"
              value={formData.dni}
              onChange={(e) => {
                if (client) return;
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, dni: value });
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Domicilio</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Av. Siempre Viva 742"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: +54 9 11..."
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
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
              {loading ? "Guardando..." : (client ? "Guardar Cambios" : "Guardar Cliente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}