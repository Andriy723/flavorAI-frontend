'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recipesApi } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CreateRecipePage() {
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        cookTime: 0,
        servings: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const recipe = await recipesApi.create(formData);
            router.push(`/recipes/${recipe.id}`);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Помилка створення рецепту');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'cookTime' || name === 'servings' ? Number(value) : value
        });
    };

    const inputClasses = `w-full px-4 py-2 rounded-lg border border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
        transition-all duration-300`;

    const textareaClasses = `w-full px-4 py-2 rounded-lg border border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
        transition-all duration-300 resize-y`;

    return (
        <ProtectedRoute>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Створити новий рецепт
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                Назва рецепту *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className={inputClasses}
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Наприклад: Борщ з м'ясом"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="cookTime" className="block text-gray-700 text-sm font-bold mb-2">
                                    Час приготування (хв) *
                                </label>
                                <input
                                    type="number"
                                    id="cookTime"
                                    name="cookTime"
                                    className={inputClasses}
                                    value={formData.cookTime}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div>
                                <label htmlFor="servings" className="block text-gray-700 text-sm font-bold mb-2">
                                    Кількість порцій *
                                </label>
                                <input
                                    type="number"
                                    id="servings"
                                    name="servings"
                                    className={inputClasses}
                                    value={formData.servings}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">
                                Інгредієнти *
                            </label>
                            <textarea
                                id="ingredients"
                                name="ingredients"
                                rows={8}
                                className={textareaClasses}
                                value={formData.ingredients}
                                onChange={handleChange}
                                required
                                placeholder={`Наприклад:
- 500г яловичини
- 2 картоплі
- 1 морква
- 1 буряк
- 200г капусти`}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="instructions" className="block text-gray-700 text-sm font-bold mb-2">
                                Інструкції приготування *
                            </label>
                            <textarea
                                id="instructions"
                                name="instructions"
                                rows={10}
                                className={textareaClasses}
                                value={formData.instructions}
                                onChange={handleChange}
                                required
                                placeholder="Детально опишіть кроки приготування..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Створення...' : 'Створити рецепт'}
                            </button>

                            <button
                                type="button"
                                className="flex-1 btn-secondary"
                                onClick={() => router.back()}
                            >
                                Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
