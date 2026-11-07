import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'client-app',
      testMatch: /client-app.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173'
      }
    },
    {
      name: 'management-app',
      testMatch: /management-app.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174'
      }
    }
  ],
  webServer: [
    {
      command: 'pnpm --filter @web-platform-sdk/sample-client-app dev --port 5173',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'pnpm --filter @web-platform-sdk/sample-management-app dev --port 5174',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ]
})
