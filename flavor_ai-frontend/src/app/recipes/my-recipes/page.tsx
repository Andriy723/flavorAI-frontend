
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { recipesApi } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import ProtectedRoute from '@/components/ProtectedRoute';

function DeleteConfirmModal({
                                isOpen,
                                onClose,
                                onConfirm,
                                recipeName,
                                isDeleting
                            }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    recipeName: string;
    isDeleting: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Підтвердження видалення
                    </h3>
                </div>

                <p className="text-gray-600 mb-6">
                    Ви впевнені, що хочете видалити рецепт <strong>"{recipeName}"</strong>?
                    <br />
                    <span className="text-red-600 text-sm">Цю дію неможливо скасувати.</span>
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg font-medium transition-colors duration-200"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Видалення...
                            </>
                        ) : (
                            'Видалити'
                        )}
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

export default function MyRecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        recipe: Recipe | null;
    }>({ isOpen: false, recipe: null });

    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ isOpen: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const data = await recipesApi.getMyRecipes();
                setRecipes(data);
            } catch (error) {
                console.error('Error fetching my recipes:', error);
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Помилка',
                    message: 'Не вдалося завантажити рецепти. Спробуйте оновити сторінку.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, []);

    const openDeleteModal = (recipe: Recipe) => {
        setDeleteModal({ isOpen: true, recipe });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, recipe: null });
    };

    const handleDeleteRecipe = async () => {
        if (!deleteModal.recipe) return;

        const recipeId = deleteModal.recipe.id;
        setDeletingId(recipeId);

        try {
            await recipesApi.delete(recipeId);
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
            closeDeleteModal();
            setNotification({
                isOpen: true,
                type: 'success',
                title: 'Успіх!',
                message: 'Рецепт було успішно видалено.'
            });
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Помилка',
                message: 'Не вдалося видалити рецепт. Спробуйте ще раз.'
            });
        } finally {
            setDeletingId(null);
        }
    };

    const closeNotification = () => {
        setNotification({ isOpen: false, type: 'success', title: '', message: '' });
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center min-h-64">
                    <div className="text-xl">Завантаження ваших рецептів...</div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Мої рецепти
                    </h1>
                    <Link
                        href="/recipes/create"
                        className="btn-primary"
                    >
                        + Додати новий рецепт
                    </Link>
                </div>

                {recipes.length === 0 ? (
                    <div className="text-center text-gray-600 mt-12">
                        <div className="text-6xl mb-4">👨‍🍳</div>
                        <h2 className="text-2xl mb-4">У вас поки немає рецептів</h2>
                        <p className="mb-6">Створіть свій перший рецепт і поділіться ним з іншими!</p>
                        <Link
                            href="/recipes/create"
                            className="btn-primary inline-block"
                        >
                            Створити перший рецепт
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className="relative group">
                                <RecipeCard recipe={recipe} />

                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Link
                                        href={`/recipes/edit/${recipe.id}`}
                                        className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 p-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group/edit"
                                        title="Редагувати рецепт"
                                    >
                                        <svg className="w-4 h-4 group-hover/edit:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>

                                    <button
                                        onClick={() => openDeleteModal(recipe)}
                                        disabled={deletingId === recipe.id}
                                        className="bg-white/90 backdrop-blur-sm hover:bg-red-50 disabled:bg-gray-100 text-red-600 disabled:text-gray-400 border border-red-200 hover:border-red-300 disabled:border-gray-200 p-2.5 rounded-lg shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 group/delete"
                                        title="Видалити рецепт"
                                    >
                                        {deletingId === recipe.id ? (
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DeleteConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteRecipe}
                    recipeName={deleteModal.recipe?.title || ''}
                    isDeleting={deletingId !== null}
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