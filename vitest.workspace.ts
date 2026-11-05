import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineWorkspace } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

export default defineWorkspace([
  {
    // Fast unit and integration tests across packages using jsdom / node
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['packages/**/*.{test,spec}.{ts,tsx}'],
      setupFiles: [path.resolve(__dirname, 'vitest-setup.ts')],
      passWithNoTests: true
    }
  },
  {
    // Storybook UI & A11y tests running in browser headless mode
    plugins: [
      storybookTest({ configDir: path.join(dirname, '.storybook') })
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: 'chromium' }]
      }
    }
  }
])
