/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, max-age=0' },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;