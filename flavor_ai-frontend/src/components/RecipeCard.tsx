'use client';

import Link from 'next/link';
import { Recipe } from '@/types';
import { useEffect, useState } from 'react';
import { ratingsApi } from '@/lib/api';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const [averageRating, setAverageRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const rating = await ratingsApi.getAverageRating(recipe.id);
                setAverageRating(rating);
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };
        fetchRating();
    }, [recipe.id]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
        ★
      </span>
        ));
    };

    return (
        <div className="recipe-card">
            <div className="recipe-card-image">
                <span className="text-6xl text-white">🍽️</span>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {recipe.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                    Автор: {recipe.author.name}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>⏱️ {recipe.cookTime} хв</span>
                    <span>👥 {recipe.servings} порцій</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {renderStars(averageRating.average)}
                        <span className="ml-2 text-sm text-gray-600">
              ({averageRating.count})
            </span>
                    </div>

                    <Link
                        href={`/recipes/${recipe.id}`}
                        className="btn-primary text-sm"
                    >
                        Переглянути
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;