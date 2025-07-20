/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                orange: {
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                },
            },
        },
    },
    plugins: [],
}