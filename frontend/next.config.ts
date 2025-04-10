import type { NextConfig } from 'next';
import path from 'path';
import withPWA from 'next-pwa';

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
  webpack: (config, { dev, isServer }) => {
    // SVG 설정 유지
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 프로덕션 환경에서 console.log 제거
    if (!dev && !isServer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config.optimization.minimizer.forEach((minimizer: any) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true;
        }
      });
    }

    return config;
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://finopenapi.ssafy.io/ssafy/api/v1/:path*', // 슬래시 추가
  //     },
  //   ];
  // },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 개발 중에는 꺼두기
  skipWaiting: true,
  clientsClaim: true,
})(nextConfig);
