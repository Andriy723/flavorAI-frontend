'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from '@/types';
import { recipesApi, ratingsApi } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import StarRating from '@/components/StarRating';

export default function RecipeDetailPage() {
    const params = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!params.id) return;

            try {
                const data = await recipesApi.getById(params.id as string);
                setRecipe(data);

                const rating = await ratingsApi.getAverageRating(params.id as string);
                setAverageRating(rating);
            } catch (error) {
                setError('Рецепт не знайдено');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [params.id]);

    const handleRatingChange = async (rating: number) => {
        if (!recipe || !isAuthenticated()) return;

        try {
            await ratingsApi.create({
                rating,
                recipeId: recipe.id
            });
            setUserRating(rating);

            const updatedRating = await ratingsApi.getAverageRating(recipe.id);
            setAverageRating(updatedRating);
        } catch (error) {
            console.error('Error rating recipe:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-xl">Завантаження рецепту...</div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="text-center text-red-600 mt-12">
                <div className="text-6xl mb-4">Вибачте</div>
                <h2 className="text-2xl mb-2">Помилка</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-8xl text-white">🍽️</span>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {recipe.title}
                            </h1>
                            <p className="text-gray-600">
                                Автор: <span className="font-medium">{recipe.author.name}</span>
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center justify-end mb-2">
                                <StarRating
                                    rating={averageRating.average}
                                    readonly
                                    size="lg"
                                />
                                <span className="ml-2 text-gray-600">
                  ({averageRating.count} оцінок)
                </span>
                            </div>

                            {isAuthenticated() && (
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <span className="text-sm text-gray-600">Ваша оцінка:</span>
                                    <StarRating
                                        rating={userRating}
                                        onRatingChange={handleRatingChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">⏱️</div>
                            <div className="text-lg font-semibold">{recipe.cookTime} хв</div>
                            <div className="text-sm text-gray-600">Час приготування</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">👥</div>
                            <div className="text-lg font-semibold">{recipe.servings} порцій</div>
                            <div className="text-sm text-gray-600">Кількість порцій</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">📅</div>
                            <div className="text-lg font-semibold">
                                {new Date(recipe.createdAt).toLocaleDateString('uk-UA')}
                            </div>
                            <div className="text-sm text-gray-600">Дата створення</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                Інгредієнти
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700 font-medium">
                  {recipe.ingredients}
                </pre>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                                Інструкції
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {recipe.instructions}
                </pre>
                            </div>
                        </div>
                    </div>

                    {!isAuthenticated() && (
                        <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-orange-700">
                                <span className="font-medium">Увійдіть в акаунт</span>, щоб оцінити цей рецепт
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}