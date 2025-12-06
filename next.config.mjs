/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/publication/**',
        search: '?v=*',
      },
    ],
  },
};

export default nextConfig;
