import { type UserInfo } from "../../types/auth";
import { UserCard } from "./UserCard";

interface UsersListProps {
  users: UserInfo[];
  onEdit?: (user: UserInfo) => void;
  onDelete?: (id: number) => void;
}

export function UsersList({ users, onEdit, onDelete }: UsersListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}