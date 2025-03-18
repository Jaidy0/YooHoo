import type { NextConfig } from 'next';
const path = require('path');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    prependData: `@use "abstracts/variables" as *;`,
  },
};

export default nextConfig;
