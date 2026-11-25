import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

const EXTERNAL_DEPS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@mudrichenkoevgeny/shared-foundation',
  'clsx',
  'qrcode.react',
  'tailwind-merge',
  'zod',
  'zustand'
]

export default defineConfig(({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  const plugins = [
    svgr({
      include: '**/*.svg?react',
      svgrOptions: {
        icon: true
      }
    })
  ]

  if (!isTest && command === 'build') {
    plugins.push(dts({ rollupTypes: true }))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/core/common': fileURLToPath(new URL('./src/core/common/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/core/security': fileURLToPath(new URL('./src/core/security/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/core/settings': fileURLToPath(new URL('./src/core/settings/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/core/storage': fileURLToPath(new URL('./src/core/storage/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/feature/user': fileURLToPath(new URL('./src/feature/user/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/feature/client-user': fileURLToPath(new URL('./src/feature/client-user/index.ts', import.meta.url)),
        '@mudrichenkoevgeny/web-platform-sdk/feature/management-user': fileURLToPath(new URL('./src/feature/management-user/index.ts', import.meta.url))
      }
    },
    test: {
      name: 'sdk',
      globals: true,
      environment: 'jsdom',
      setupFiles: ['../../tools/testing/vitest-setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      server: {
        deps: {
          inline: ['@mudrichenkoevgeny/shared-foundation']
        }
      }
    },
    build: {
      lib: {
        entry: {
          'core/common/index': resolve(__dirname, 'src/core/common/index.ts'),
          'core/security/index': resolve(__dirname, 'src/core/security/index.ts'),
          'core/settings/index': resolve(__dirname, 'src/core/settings/index.ts'),
          'core/storage/index': resolve(__dirname, 'src/core/storage/index.ts'),
          'feature/user/index': resolve(__dirname, 'src/feature/user/index.ts'),
          'feature/client-user/index': resolve(__dirname, 'src/feature/client-user/index.ts'),
          'feature/management-user/index': resolve(__dirname, 'src/feature/management-user/index.ts')
        },
        formats: ['es']
      },
      rollupOptions: {
        external: (id) => {
          if (id.includes('.svg')) {
            return false
          }
          return EXTERNAL_DEPS.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
        }
      }
    }
  }
})
