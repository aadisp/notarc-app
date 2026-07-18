"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ProductSort({
    value,
    onChange,
}: ProductSortProps) {
    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-full lg:w-64">
                <SelectValue />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="newest">
                    Newest
                </SelectItem>

                <SelectItem value="price-low">
                    Price: Low to High
                </SelectItem>

                <SelectItem value="price-high">
                    Price: High to Low
                </SelectItem>

                <SelectItem value="name-asc">
                    Name: A → Z
                </SelectItem>

                <SelectItem value="name-desc">
                    Name: Z → A
                </SelectItem>
            </SelectContent>
        </Select>
    );
}