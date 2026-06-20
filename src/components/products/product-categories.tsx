export default function ProductCategories() {
  const categories = [
    "All",
    "Drones",
    "Motors",
    "Frames",
    "Electronics",
    "Batteries",
  ];

  return (
    <div className="mb-10 flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          className="rounded-full border px-4 py-2"
        >
          {category}
        </button>
      ))}
    </div>
  );
}