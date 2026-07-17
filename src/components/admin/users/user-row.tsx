import RoleSelect from "./role-select";

interface User {
  id: string;

  email: string;
  username?: string;

  role: string;
}

interface UserRowProps {
  user: User;

  onRoleChange: (
    userId: string,
    role: string
  ) => void;

  currentUserId?: string;
}

export default function UserRow({
  user,
  onRoleChange,
  currentUserId,
}: UserRowProps) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >

      <div>

        <h2 className="text-xl font-semibold">
          {user.username || "Unnamed User"}
        </h2>

        <p className="text-gray-500">
          {user.email}
        </p>

      </div>

      <div className="flex items-center gap-4">

        {user.id === currentUserId ? (
        <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
            {user.role} (You)
        </span>
        ) : (
        <RoleSelect
            value={user.role}
            onChange={(value) =>
            onRoleChange(user.id, value)
            }
        />
        )}

      </div>

    </div>

  );

}