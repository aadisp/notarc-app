export const PRODUCT_CATEGORIES = [
    "Drone",
    "Motor",
    "Frame",
    "Electronics",
    "Power",
    "Navigation",
];

interface ProductCategoriesProps {
    selected: Set<string>;
    onToggle: (category: string) => void;
    onClear: () => void;
}

export default function ProductCategories({
    selected,
    onToggle,
    onClear,
}: ProductCategoriesProps) {

    const isAllActive = selected.size === 0;

    return (
        <div className="mb-10 flex flex-wrap gap-3">

            <button
                onClick={onClear}
                className={`rounded-full border px-4 py-2 transition ${
                    isAllActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-white hover:text-black"
                }`}
            >
                All
            </button>

            {PRODUCT_CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => onToggle(category)}
                    className={`rounded-full border px-4 py-2 transition ${
                        selected.has(category)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-white hover:text-black"
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}