interface UserStatsProps {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export default function UserStats({
  totalUsers,
  adminUsers,
  regularUsers,
}: UserStatsProps) {
  return (
    <div
      className="
        mb-10
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Total Users
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {totalUsers}
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Admins
        </p>

        <h2 className="mt-2 text-4xl font-bold text-orange-600">
          {adminUsers}
        </h2>
      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <p className="text-sm text-gray-500">
          Users
        </p>

        <h2 className="mt-2 text-4xl font-bold text-blue-600">
          {regularUsers}
        </h2>
      </div>
    </div>
  );
}