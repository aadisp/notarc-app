import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: number;
    className?: string;
}

export default function StarRating({
    rating,
    size = 16,
    className = "",
}: StarRatingProps) {
    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {Array.from({ length: 5 }, (_, index) => {

                const filled = index < Math.round(rating);

                return (
                    <Star
                        key={index}
                        size={size}
                        className={
                            filled
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-white/20"
                        }
                    />
                );

            })}
        </div>
    );
}