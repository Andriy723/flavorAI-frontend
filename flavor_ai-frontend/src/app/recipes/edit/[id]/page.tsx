'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { recipesApi } from '@/lib/api';
import { Recipe, CreateRecipeDto } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

function CancelConfirmModal({
                                isOpen,
                                onClose,
                                onConfirm,
                                hasChanges
                            }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    hasChanges: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Скасувати редагування?
                    </h3>
                </div>

                <p className="text-gray-600 mb-6">
                    {hasChanges
                        ? "У вас є незбережені зміни. Ви впевнені, що хочете скасувати редагування? Всі зміни будуть втрачені."
                        : "Ви впевнені, що хочете скасувати редагування рецепту?"
                    }
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    >
                        Продовжити редагування
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                        Так, скасувати
                    </button>
                </div>
            </div>
        </div>
    );
}

function NotificationModal({
                               isOpen,
                               onClose,
                               type,
                               title,
                               message
                           }: {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
}) {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mr-3`}>
                        {isSuccess ? (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>

                <p className="text-gray-600 mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className={`w-full px-4 py-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg font-medium transition-colors duration-200`}
                >
                    Зрозуміло
                </button>
            </div>
        </div>
    );
}

export default function EditRecipePage() {
    const router = useRouter();
    const params = useParams();
    const recipeId = params.id as string;

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [originalData, setOriginalData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        cookTime: 0,
        servings: 1,
    });
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        cookTime: 0,
        servings: 1,
    });

    const [cancelModal, setCancelModal] = useState(false);
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ isOpen: false, type: 'success', title: '', message: '' });

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await recipesApi.getById(recipeId);
                setRecipe(data);
                const recipeData = {
                    title: data.title,
                    ingredients: data.ingredients,
                    instructions: data.instructions,
                    cookTime: data.cookTime,
                    servings: data.servings,
                };
                setFormData(recipeData);
                setOriginalData(recipeData);
            } catch (error) {
                console.error('Error fetching recipe:', error);
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Помилка',
                    message: 'Не вдалося завантажити рецепт. Спробуйте ще раз.'
                });
            } finally {
                setLoading(false);
            }
        };

        if (recipeId) {
            fetchRecipe();
        }
    }, [recipeId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'cookTime' || name === 'servings' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.ingredients.trim() || !formData.instructions.trim()) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Помилка валідації',
                message: 'Будь ласка, заповніть всі обов\'язкові поля (назва, інгредієнти, інструкції).'
            });
            return;
        }

        if (formData.cookTime < 1 || formData.servings < 1) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Помилка валідації',
                message: 'Час приготування та кількість порцій повинні бути більше нуля.'
            });
            return;
        }

        setUpdating(true);
        try {
            await recipesApi.update(recipeId, formData);
            setNotification({
                isOpen: true,
                type: 'success',
                title: 'Успіх!',
                message: 'Рецепт було успішно оновлено. Перенаправляємо на сторінку ваших рецептів.'
            });

            setTimeout(() => {
                router.push('/recipes/my-recipes');
            }, 2000);
        } catch (error) {
            console.error('Error updating recipe:', error);
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Помилка',
                message: 'Не вдалося оновити рецепт. Спробуйте ще раз.'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            setCancelModal(true);
        } else {
            router.back();
        }
    };

    const confirmCancel = () => {
        setCancelModal(false);
        router.back();
    };

    const closeNotification = () => {
        setNotification({ isOpen: false, type: 'success', title: '', message: '' });
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center min-h-64">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <div className="text-xl text-gray-600">Завантаження рецепту...</div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!recipe) {
        return (
            <ProtectedRoute>
                <div className="text-center text-red-600 mt-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Рецепт не знайдено</h2>
                    <p className="text-gray-600 mb-6">Можливо рецепт було видалено або у вас немає доступу до нього.</p>
                    <button
                        onClick={() => router.push('/recipes/my-recipes')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Повернутися до рецептів
                    </button>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleCancel}
                            className="text-blue-600 hover:text-blue-800 flex items-center group transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Повернутися назад
                        </button>
                        {hasChanges && (
                            <span className="ml-4 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                ● Є незбережені зміни
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Редагувати рецепт
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Внесіть необхідні зміни до вашого рецепту
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Назва рецепту *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            maxLength={100}
                            required
                            placeholder="Введіть назву рецепту..."
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {formData.title.length}/100
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                            Інгредієнти *
                        </label>
                        <textarea
                            id="ingredients"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                            placeholder="Напишіть кожен інгредієнт з нового рядка...&#10;Наприклад:&#10;• 2 склянки борошна&#10;• 1 яйце&#10;• 500 мл молока"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                            Інструкції приготування *
                        </label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                            placeholder="Опишіть покрокові інструкції приготування...&#10;Наприклад:&#10;1. Розігрійте духовку до 180°C&#10;2. Змішайте сухі інгредієнти&#10;3. Додайте рідкі інгредієнти..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
                                Час приготування (хвилини) *
                            </label>
                            <input
                                type="number"
                                id="cookTime"
                                name="cookTime"
                                value={formData.cookTime}
                                onChange={handleInputChange}
                                min="1"
                                max="1440"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                                Кількість порцій *
                            </label>
                            <input
                                type="number"
                                id="servings"
                                name="servings"
                                value={formData.servings}
                                onChange={handleInputChange}
                                min="1"
                                max="50"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={updating || !hasChanges}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                        >
                            {updating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Збереження...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Зберегти зміни
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={updating}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Скасувати
                        </button>
                    </div>

                    {!hasChanges && (
                        <div className="text-center text-gray-500 text-sm">
                            Внесіть зміни до форми, щоб активувати кнопку збереження
                        </div>
                    )}
                </form>

                <CancelConfirmModal
                    isOpen={cancelModal}
                    onClose={() => setCancelModal(false)}
                    onConfirm={confirmCancel}
                    hasChanges={hasChanges}
                />

                <NotificationModal
                    isOpen={notification.isOpen}
                    onClose={closeNotification}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                />
            </div>
        </ProtectedRoute>
    );
}
