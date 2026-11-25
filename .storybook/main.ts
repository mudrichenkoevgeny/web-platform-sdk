import type { StorybookConfig } from '@storybook/react-vite'
import svgr from 'vite-plugin-svgr'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath, URL } from 'node:url'
import { mergeConfig } from 'vite'
import { sdkTailwindPreset } from '../packages/sdk/src/core/common/theme/tailwind-preset.ts'

if (typeof require !== 'undefined' && require.extensions && !require.extensions['.svg']) {
  require.extensions['.svg'] = () => () => null
}

const config: StorybookConfig = {
  stories: [
    '../packages/sdk/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp'
  ],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      plugins: [
        svgr({
          svgrOptions: {
            icon: true
          }
        })
      ],
      css: {
        postcss: {
          plugins: [
            tailwindcss({
              presets: [sdkTailwindPreset],
              content: [
                './packages/sdk/src/**/*.{js,ts,jsx,tsx}'
              ]
            }),
            autoprefixer()
          ]
        }
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../packages/sdk/src', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/core/common': fileURLToPath(new URL('../packages/sdk/src/core/common/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/core/security': fileURLToPath(new URL('../packages/sdk/src/core/security/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/core/settings': fileURLToPath(new URL('../packages/sdk/src/core/settings/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/core/storage': fileURLToPath(new URL('../packages/sdk/src/core/storage/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/feature/user': fileURLToPath(new URL('../packages/sdk/src/feature/user/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/feature/client-user': fileURLToPath(new URL('../packages/sdk/src/feature/client-user/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/feature/management-user': fileURLToPath(new URL('../packages/sdk/src/feature/management-user/index.ts', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/tokens.css': fileURLToPath(new URL('../packages/sdk/src/core/common/theme/index.css', import.meta.url)),
          '@mudrichenkoevgeny/web-platform-sdk/theme.css': fileURLToPath(new URL('../packages/sdk/src/core/common/theme/index.css', import.meta.url))
        }
      }
    })
  }
}

export default config
