'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const inputClasses = `w-full px-4 py-2 rounded-lg border border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
        transition-all duration-300`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login(formData);
            setToken(response.access_token);
            window.location.href = '/';
        } catch (error: any) {
            if (error.response?.status === 401) {
                setError('Неправильний email або пароль');
            } else if (error.response?.status === 422) {
                setError('Некоректні дані. Перевірте правильність введення email та пароля');
            } else if (error.response?.status === 404) {
                setError('Користувача з таким email не знайдено');
            } else {
                setError(error.response?.data?.message || 'Неправильні дані для входу. Спробуйте ще раз');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">Вхід до FlavorAI</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={inputClasses}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={inputClasses}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full btn-primary" disabled={loading}>
                        {loading ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-gray-600">Немає акаунта? </span>
                    <Link href="/register" className="text-orange-500 hover:text-orange-600">Зареєструйтесь</Link>
                </div>
            </div>
        </div>
    );
}
