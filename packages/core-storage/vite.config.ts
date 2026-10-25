/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WebPlatformSdkCoreStorage',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        '@mudrichenkoevgeny/shared-foundation',
        '@mudrichenkoevgeny/web-platform-sdk-core-common'
      ],
      output: {
        globals: {}
      }
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
})
