import Link from "next/link";
import { PackageSearch } from "lucide-react";
import type { CartItem } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface CheckoutItemsProps {
    items: CartItem[];
    productsById: Map<string, Product>;
}

export default function CheckoutItems({
    items,
    productsById,
}: CheckoutItemsProps) {
    return (
        <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {

                const product = productsById.get(item.id);
                const imageUrl = product?.imageUrls?.[0];

                return (
                    <div
                        key={item.id}
                        className="
                            flex
                            items-center
                            gap-5
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-5
                            backdrop-blur-sm
                        "
                    >

                        <Link
                            href={`/products/${item.slug}`}
                            className="
                                relative
                                aspect-square
                                w-20
                                shrink-0
                                overflow-hidden
                                rounded-lg
                                bg-gradient-to-br
                                from-white/[0.06]
                                to-white/[0.02]
                            "
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/30">
                                    <PackageSearch className="h-6 w-6" />
                                </div>
                            )}
                        </Link>

                        <div className="flex flex-1 justify-between">

                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    {item.name}
                                </h2>

                                <p className="text-white/50">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <h2 className="text-xl font-bold text-white">
                                ₹{item.price * item.quantity}
                            </h2>

                        </div>

                    </div>
                );

            })}
        </div>
    );
}