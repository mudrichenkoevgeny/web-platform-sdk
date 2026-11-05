import { describe, it, expect } from 'vitest'
import type { HttpClientConfigPlugin } from '@/network/http-client/http-client-config-plugin'

describe('HttpClientConfigPlugin', () => {
  it('allows plugin implementation with onRequest and onResponse hooks', async () => {
    const plugin: HttpClientConfigPlugin = {
      onRequest(_url: string, init: RequestInit) {
        return {
          ...init,
          headers: {
            ...init.headers,
            'X-Test-Header': 'test-value'
          }
        }
      },
      onResponse(response: Response) {
        return response
      }
    }

    const init: RequestInit = { method: 'GET' }
    const updatedInit = await plugin.onRequest!('https://example.com', init)
    expect(updatedInit.headers).toEqual({ 'X-Test-Header': 'test-value' })

    const response = new Response('ok', { status: 200 })
    const updatedResponse = await plugin.onResponse!(response)
    expect(updatedResponse).toBe(response)
  })
})
