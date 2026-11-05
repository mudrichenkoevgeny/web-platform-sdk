import { describe, it, expect } from 'vitest'
import { HttpClientConfigPluginMock } from '@/mock/network/http-client-config-plugin-mock'

describe('HttpClientConfigPluginMock', () => {
  it('HttpClientConfigPluginMock records request and response', async () => {
    const plugin = new HttpClientConfigPluginMock()
    const init: RequestInit = { method: 'GET' }
    const response = new Response('ok', { status: 200 })

    await plugin.onRequest('https://api.example.com/test', init)
    await plugin.onResponse(response)

    expect(plugin.onRequestCallCount).toBe(1)
    expect(plugin.lastRequestUrl).toBe('https://api.example.com/test')
    expect(plugin.onResponseCallCount).toBe(1)
    expect(plugin.lastResponse).toBe(response)
  })
})
