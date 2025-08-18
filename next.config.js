
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is required to allow the Next.js dev server to be accessed from
    // a different domain, which is the case in cloud development environments.
    allowedDevOrigins: [
      'https://6000-firebase-studio-1755331739303.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev',
    ],
  },
};

module.exports = nextConfig;

    