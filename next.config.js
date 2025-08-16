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
    ],
  },
  experimental: {
    // This is the correct place for this option
  },
  allowedDevOrigins: ["https://6000-firebase-studio-1755331739303.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev/"],
};

module.exports = nextConfig;
