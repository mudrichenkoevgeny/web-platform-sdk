import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  const plugins = [
    svgr({
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
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    test: {
      name: 'core-settings',
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      server: {
        deps: {
          inline: ['@mudrichenkoevgeny/shared-foundation']
        }
      }
    },
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'WebPlatformSdkCoreSettings',
        fileName: 'index',
        formats: ['es']
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime']
      }
    }
  }
})
