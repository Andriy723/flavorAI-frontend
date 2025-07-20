'use client';

import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({
                        rating,
                        onRatingChange,
                        readonly = false,
                        size = 'md',
                    }: StarRatingProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    const handleStarClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const getColorClass = (starValue: number) => {
        if (hovered !== null) {
            return starValue <= hovered ? 'text-yellow-400' : 'text-gray-300';
        }
        return starValue <= rating ? 'text-yellow-400' : 'text-gray-300';
    };

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => {
                const starValue = i + 1;
                return (
                    <button
                        key={i}
                        type="button"
                        className={`${sizeClasses[size]} ${getColorClass(starValue)} ${
                            readonly
                                ? 'cursor-default'
                                : 'cursor-pointer hover:text-yellow-300 transition-colors'
                        }`}
                        onClick={() => handleStarClick(starValue)}
                        onMouseEnter={() => !readonly && setHovered(starValue)}
                        onMouseLeave={() => !readonly && setHovered(null)}
                        disabled={readonly}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
