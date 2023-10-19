/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverActionsBodySizeLimit: '20mb',
    },
}

module.exports = nextConfig
