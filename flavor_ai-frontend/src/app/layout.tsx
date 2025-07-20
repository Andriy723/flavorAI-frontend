import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'FlavorAI - Discover Amazing Recipes',
    description: 'Your personal recipe discovery platform',
    icons: {
        icon: './img.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uk" className="scroll-smooth">
        <body className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}