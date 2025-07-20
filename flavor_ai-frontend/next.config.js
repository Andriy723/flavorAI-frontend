/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        swcPlugins: [],
        css: true,
        appDir: true,
    },
};

module.exports = nextConfig;
