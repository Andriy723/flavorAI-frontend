'use client';

export default function Spinner() {
    return (
        <div className="flex items-center justify-center h-16">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
