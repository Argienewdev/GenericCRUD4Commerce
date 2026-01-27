import { Edit2, Trash2 } from "lucide-react";
import { type UserInfo } from "../../types/auth";

interface UserCardProps {
  user: UserInfo;
  onEdit?: (user: UserInfo) => void;
  onDelete?: (id: number) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800">
              {user.username}
            </h3>
            <div className="flex gap-4 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "ADMIN"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role === "ADMIN" ? "Administrador" : "Vendedor"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(user)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => onDelete?.(user.id)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}