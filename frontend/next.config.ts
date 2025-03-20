import type { NextConfig } from 'next';
const path = require('path');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 검사 건너뛰기
  },
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
