interface ProductCategoriesProps {
    selected: string;
    onSelect: (category: string) => void;
}

export default function ProductCategories({
    selected,
    onSelect,
}: ProductCategoriesProps) {

    const categories = [
        "All",
        "Drone",
        "Motor",
        "Frame",
        "Electronics",
        "Power",
        "Navigation",
    ];

    return (
        <div className="mb-10 flex flex-wrap gap-3">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={`rounded-full border px-4 py-2 transition ${
                        selected === category
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}