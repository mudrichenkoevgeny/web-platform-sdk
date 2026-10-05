import { describe, it, expect, vi } from 'vitest'
import { HttpClient } from '@/network/http-client/http-client'
import { WebDeviceInfoProvider } from '@/platform/device-info/device-info-provider'
import { EncryptedCommonStorage } from '@/storage/common/encrypted-common-storage'
import { createInMemoryEncryptedSettings } from '@/mock/storage/encrypted-settings-mock'
import { ApiException } from '@/error/model/api-exception'
import { CommonHttpHeaders } from '@/network/contract/common-http-headers'

describe('HttpClient', () => {
  const createTestHttpClient = (customFetch: typeof fetch, logger?: (msg: string) => void) => {
    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)
    const deviceInfoProvider = new WebDeviceInfoProvider(storage)

    return new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider,
      customFetch,
      logger
    })
  }

  it('adds SDK headers and sends request to correct URL', async () => {
    const mockResponse = new Response(JSON.stringify({ result: 'ok' }), { status: 200 })
    const fetchSpy = vi.fn().mockResolvedValue(mockResponse)

    const client = createTestHttpClient(fetchSpy as unknown as typeof fetch)
    const data = await client.request<{ result: string }>('/users')

    expect(data).toEqual({ result: 'ok' })
    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object))

    const options = fetchSpy.mock.calls[0]![1] as RequestInit
    const headers = options.headers as Headers
    expect(headers.has(CommonHttpHeaders.TRACE_HEADER_NAME)).toBe(true)
    expect(headers.get(CommonHttpHeaders.CLIENT_TYPE_HEADER_NAME)).toBe('WEB')
    expect(headers.get('Accept')).toBe('application/json')
  })

  it('throws ApiException when response contains valid ApiErrorResponse', async () => {
    const errorPayload = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      code: 'USER_NOT_FOUND',
      message: 'User does not exist',
      args: { userId: '123' }
    }
    const mockResponse = new Response(JSON.stringify(errorPayload), { status: 404 })
    const fetchSpy = vi.fn().mockResolvedValue(mockResponse)

    const client = createTestHttpClient(fetchSpy as unknown as typeof fetch)

    await expect(client.request('/users/123')).rejects.toThrow(ApiException)
  })

  it('throws generic Error when response is non-2xx and not ApiErrorResponse', async () => {
    const mockResponse = new Response('Bad Gateway', { status: 502, statusText: 'Bad Gateway' })
    const fetchSpy = vi.fn().mockResolvedValue(mockResponse)

    const client = createTestHttpClient(fetchSpy as unknown as typeof fetch)

    await expect(client.request('/users')).rejects.toThrow('HTTP Error 502: Bad Gateway')
  })

  it('runs plugin onRequest and onResponse hooks', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), { status: 200 })
    const fetchSpy = vi.fn().mockResolvedValue(mockResponse)

    const onRequestSpy = vi.fn().mockImplementation((_url, init) => init)
    const onResponseSpy = vi.fn().mockImplementation(res => res)

    const settings = createInMemoryEncryptedSettings()
    const storage = new EncryptedCommonStorage(settings)
    const deviceInfoProvider = new WebDeviceInfoProvider(storage)

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
      deviceInfoProvider,
      customFetch: fetchSpy as unknown as typeof fetch,
      plugins: [{ onRequest: onRequestSpy, onResponse: onResponseSpy }]
    })

    await client.request('/test')

    expect(onRequestSpy).toHaveBeenCalled()
    expect(onResponseSpy).toHaveBeenCalled()
  })
})
