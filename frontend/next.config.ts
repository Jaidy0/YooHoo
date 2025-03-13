import type { NextConfig } from 'next';
const path = require('path');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@use "abstracts/variables" as *; @use "abstracts/mixins" as *;`,
  },
};

export default nextConfig;
