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
  async redirects() {
    return [
      {
        source: '/software',
        destination: '/logiciel',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
