import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 검사 건너뛰기
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/assets/styles')],
    prependData: `@use "abstracts/variables" as *;`,
  },
    images: {
    domains: ['yoohoo-bucket.s3.ap-southeast-2.amazonaws.com'],
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
