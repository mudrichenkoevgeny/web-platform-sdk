import { test, expect } from '@playwright/test'
import {
  ClientAuthNavigation,
  ClientUserNavigation,
  OpenStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'

interface MemoryMetrics {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

const extractRoutePath = (navNode: { route?: string; ROUTE?: string }): string => {
  return navNode.route ?? navNode.ROUTE ?? ''
}

test.describe('Client Application - Performance & Memory Leak Tracking', () => {
  test('Track heap memory and verify no memory leak across SPA navigation cycles', async ({ page }) => {
    await page.goto(extractRoutePath(ClientAuthNavigation.LoginByEmail))
    await page.waitForLoadState('networkidle')

    const initialMetrics = await page.evaluate((): MemoryMetrics => {
      const memory = performance.memory
      return {
        usedJSHeapSize: memory?.usedJSHeapSize ?? 0,
        totalJSHeapSize: memory?.totalJSHeapSize ?? 0,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit ?? 0
      }
    })

    const routes = [
      extractRoutePath(ClientAuthNavigation.LoginByEmail),
      extractRoutePath(ClientUserNavigation.UserEdit),
      extractRoutePath(OpenStorageNavigation.FileList),
      extractRoutePath(ClientUserNavigation.SessionList),
      extractRoutePath(ClientUserNavigation.IdentifierList)
    ]

    for (let cycle = 0; cycle < 3; cycle++) {
      for (const route of routes) {
        await page.goto(route)
        await page.waitForLoadState('domcontentloaded')
      }
    }

    const cdpSession = await page.context().newCDPSession(page)
    await cdpSession.send('HeapProfiler.collectGarbage')

    const finalMetrics = await page.evaluate((): MemoryMetrics => {
      const memory = performance.memory
      return {
        usedJSHeapSize: memory?.usedJSHeapSize ?? 0,
        totalJSHeapSize: memory?.totalJSHeapSize ?? 0,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit ?? 0
      }
    })

    if (initialMetrics.usedJSHeapSize > 0 && finalMetrics.usedJSHeapSize > 0) {
      const memoryGrowthBytes = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize
      const maxAllowedGrowthBytes = 35 * 1024 * 1024
      expect(memoryGrowthBytes).toBeLessThan(maxAllowedGrowthBytes)
    }

    const domNodeCount = await page.evaluate(() => document.getElementsByTagName('*').length)
    expect(domNodeCount).toBeLessThan(2000)
  })
})
