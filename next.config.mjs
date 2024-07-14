/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  target: 'serverless',
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
  // Enable verbose logging
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_VERBOSE': JSON.stringify('true'),
      })
    );
    return config;
  },
};

export default nextConfig;
