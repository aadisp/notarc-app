"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ProductSearch({
    value,
    onChange,
}: ProductSearchProps) {
    return (
        <div className="mb-12 rounded-2xl border bg-card p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                <div className="relative flex-1">

                    <Search
                        className="
                            absolute
                            left-4
                            top-1/2
                            h-5
                            w-5
                            -translate-y-1/2
                            text-muted-foreground
                        "
                    />

                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Search drones, motors, batteries, electronics..."
                        className="h-12 pl-12 pr-12"
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChange("")}
                        className="
                            absolute
                            right-1
                            top-1/2
                            -translate-y-1/2
                        "
                    >
                        <X className="h-4 w-4" />
                    </Button>

                </div>

                <Button
                    variant="outline"
                    className="h-12 gap-2"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>

            </div>

        </div>
    );
}