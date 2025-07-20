'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    const handleLogout = () => {
        removeToken();
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-extrabold text-orange-500 tracking-tight flex items-center gap-2">
                    🍽️ FlavorAI
                </Link>

                <nav className="flex items-center gap-4 text-gray-700 font-medium">
                    <Link href="/recipes" className="hover:text-orange-500 transition">Рецепти</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/recipes/my-recipes" className="hover:text-orange-500 transition">Мої</Link>
                            <Link href="/recipes/create" className="btn-primary text-sm">+ Додати</Link>
                            <button onClick={handleLogout} className="hover:text-orange-500 transition">Вийти</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-orange-500 transition">Увійти</Link>
                            <Link href="/register" className="btn-primary text-sm">Реєстрація</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
