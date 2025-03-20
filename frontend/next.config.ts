import type { NextConfig } from 'next';
const path = require('path');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    prependData: `@use "abstracts/variables" as *;`,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
