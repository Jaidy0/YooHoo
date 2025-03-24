import { join, resolve } from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

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

  // SCSS 변수를 전역으로 사용하기 위한 웹팩 설정 추가
  webpackFinal: async (config) => {
    // SCSS 설정 추가
    if (config.module && config.module.rules) {
      const rules = config.module.rules as Array<unknown>;

      // SCSS 규칙 찾기
      const scssRule = rules.find((rule: unknown) => {
        if (typeof rule !== 'object' || rule === null) return false;
        const ruleObj = rule as { test?: unknown };
        return ruleObj.test?.toString?.()?.includes('scss') ?? false;
      });

      if (
        scssRule &&
        typeof scssRule === 'object' &&
        'use' in scssRule &&
        Array.isArray(scssRule.use)
      ) {
        // sass-loader 찾기
        const sassLoaderIndex = scssRule.use.findIndex((use: unknown) => {
          if (typeof use !== 'object' || use === null) return false;
          const useObj = use as { loader?: string };
          return useObj.loader?.includes('sass-loader') ?? false;
        });

        if (
          sassLoaderIndex !== -1 &&
          typeof scssRule.use[sassLoaderIndex] === 'object'
        ) {
          const sassLoader = scssRule.use[sassLoaderIndex] as {
            options?: Record<string, unknown>;
          };
          sassLoader.options = {
            ...sassLoader.options,
            additionalData: `@use "@/assets/styles/abstracts/variables" as *;`,
            sassOptions: {
              includePaths: [join(process.cwd(), 'src/assets/styles')],
            },
          };
        }
      }
    }

    // 절대 경로 설정 추가
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': resolve(process.cwd(), 'src'),
      };
    }

    return config;
  },
};

export default config;
