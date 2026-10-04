import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig(async ({ command, mode }) => {
  const isTest = mode === 'test' || process.env.NODE_ENV === 'test'
  const plugins = [
    svgr({
      svgrOptions: {
        icon: true
      }
    })
  ]

  if (!isTest && command === 'build') {
    const { default: dts } = await import('vite-plugin-dts')
    plugins.push(dts({ rollupTypes: true }))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      server: {
        deps: {
          inline: ['@mudrichenkoevgeny/shared-foundation']
        }
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'WebPlatformSdkCoreSecurity',
        fileName: 'index',
        formats: ['es']
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime']
      }
    }
  }
})
