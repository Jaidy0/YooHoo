import type { StorybookConfig } from '@storybook/nextjs';
import '../src/assets/styles/globals.scss';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  // Next.js 통합을 위한 추가 설정
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    // 웹팩 규칙의 타입 정의
    interface WebpackRule {
      test: RegExp;
      exclude?: RegExp;
      use?: string | string[] | { loader: string; options?: any }[];
    }

    // 기존 규칙 찾기
    const fileLoaderRule = config.module?.rules?.find(
      (rule): rule is WebpackRule =>
        rule !== null &&
        typeof rule === 'object' &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        rule.test.toString().includes('svg')
    );

    // 찾은 규칙에서 svg 제외
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // SVG를 위한 새 규칙 추가
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
