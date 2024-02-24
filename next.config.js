/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns: [
            {
            protocol: 'https',
            hostname: 'ucarecdn.com',
        },
    ],
    },
}

module.exports = nextConfig
