'use client';

import { useState, useEffect } from 'react';
import { recipesApi } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const data = await recipesApi.getAll(activeSearchTerm || undefined);
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [activeSearchTerm]);

    const handleSearch = () => {
        setActiveSearchTerm(searchTerm);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setActiveSearchTerm('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-xl">Завантаження рецептів...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Всі рецепти</h1>
                    <p className="text-gray-600">Знайди ідеальний рецепт для будь-якої нагоди</p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="flex gap-2">
                        <div className={`relative flex-1 transition-all duration-300 rounded-lg border focus-within:ring-2 focus-within:ring-orange-400 ${activeSearchTerm ? 'bg-orange-50 shadow-md border-orange-400' : 'bg-white border-gray-300'}`}>
                            <input
                                type="text"
                                placeholder="Пошук рецептів..."
                                className="w-full px-4 py-2 pr-10 text-sm rounded-lg bg-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="btn-primary px-6 py-2 whitespace-nowrap"
                        >
                            🔍 Пошук
                        </button>
                    </div>

                    {activeSearchTerm && (
                        <div className="mt-2 text-center text-sm text-gray-500">
                            Результати пошуку для: "{activeSearchTerm}"
                        </div>
                    )}
                </div>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center text-gray-600 mt-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-semibold mb-2">
                        {activeSearchTerm ? 'Рецептів не знайдено' : 'Поки немає рецептів'}
                    </h2>
                    <p className="mb-4">
                        {activeSearchTerm
                            ? 'Спробуйте інший запит'
                            : 'Додайте перший рецепт до колекції'
                        }
                    </p>
                    {activeSearchTerm && (
                        <button
                            onClick={clearSearch}
                            className="btn-secondary"
                        >
                            Показати всі рецепти
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}
