'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-orange-50 border-t border-orange-100 py-10 mt-16">
            <div className="container mx-auto px-6 text-center text-gray-600">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                    <div>
                        <Link href="/" className="text-2xl font-bold text-orange-500">🍽️ FlavorAI</Link>
                        <p className="text-sm mt-2">Розкрий свої кулінарні таланти</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <Link href="/privacy" className="hover:text-orange-500">Політика конфіденційності</Link>
                        <Link href="/terms" className="hover:text-orange-500">Умови</Link>
                    </div>
                </div>
                <p className="text-sm">&copy; {new Date().getFullYear()} FlavorAI. Тестовееее.</p>
            </div>
        </footer>
    );
}
