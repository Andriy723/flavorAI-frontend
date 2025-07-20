'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const response = await authApi.register(formData);
            setToken(response.access_token);
            window.location.href = '/';
        } catch (error: any) {
            if (error.response?.status === 422) {
                setError('Користувач з таким email вже існує');
            } else if (error.response?.status === 400) {
                setError('Некоректні дані. Перевірте правильність заповнення полів');
            } else {
                setError(error.response?.data?.message || 'Помилка реєстрації. Спробуйте ще раз');
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
                <h1 className="text-2xl font-bold text-center mb-6">Реєстрація в FlavorAI</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Ім'я</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={inputClasses}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        {loading ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-gray-600">Вже є акаунт? </span>
                    <Link href="/login" className="text-orange-500 hover:text-orange-600">Увійдіть</Link>
                </div>
            </div>
        </div>
    );
}
