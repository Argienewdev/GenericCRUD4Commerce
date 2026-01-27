import { useState } from "react";
import { UsersList } from "../../components/users/UsersList";
import { UserModal } from "../../components/modals/UserModal";
import type { CreateUserRequest, UserInfo } from "../../types/auth";
import { Spinner } from "../../utils/Spinner";
import { ErrorModal } from "../../components/modals/ErrorModal";
import { usePanel } from "../../hooks/usePanel";
import { usersService } from "../../services/usersService";

export function UsersPanel() {
  const { data, loading, error, refetch } = usePanel<UserInfo>("usuarios");

  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(true);

  if (loading) return <Spinner />;

  const handleSave = async (userData: CreateUserRequest, id?: number) => {
    if (id) {
      await usersService.updateUser(id, userData);
    } else {
      await usersService.createUser(userData);
    }
    await refetch();
  };

  return (
    <div className="space-y-6">

      {/* Panel buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Nuevo Usuario
        </button>
      </div>

      {/* Users list */}
      <UsersList
        users={data}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsModalOpen(true);
        }}
        onDelete={async (id) => {
          await usersService.deleteUser(id);
          await refetch();
        }}
      />

      {/* Create / Edit modal */}
      <UserModal
        isOpen={isModalOpen}
        user={selectedUser ?? undefined}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={(data) => handleSave(data, selectedUser?.id)}
      />

      {/* Error modal */}
      <ErrorModal
        isOpen={!!error && showError}
        onClose={() => setShowError(false)}
        message={error ?? ""}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
      />
    </div>
  );
}