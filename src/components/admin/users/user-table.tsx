import UserRow from "./user-row";

interface User {
  id: string;

  email: string;
  username?: string;

  role: string;
}

interface UserTableProps {
  users: User[];

  onRoleChange: (
    userId: string,
    role: string
  ) => void;

  currentUserId?: string;
}

export default function UserTable({
  users,
  onRoleChange,
  currentUserId,
}: UserTableProps) {

  return (

    users.length === 0 ? (

        <div
        className="
            rounded-2xl
            border
            bg-white
            p-10
            text-center
            shadow-sm
        "
        >

        <h2 className="text-2xl font-semibold">
            No users found
        </h2>

        <p className="mt-2 text-gray-500">
            Try changing your search.
        </p>

        </div>

    ) : (

        <div className="space-y-6">

        {users.map((user) => (

            <UserRow
            key={user.id}
            user={user}
            onRoleChange={onRoleChange}
            currentUserId={currentUserId}
            />

        ))}

        </div>

    )

    );

}