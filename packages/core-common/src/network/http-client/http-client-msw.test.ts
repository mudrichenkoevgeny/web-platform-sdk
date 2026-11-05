import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { HttpClient } from './http-client'
import { callResult } from '@/network/utils/call-result'
import { ClientCommonErrorCodes, CommonErrorCodes, toClientDeviceIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

const BASE_URL = 'https://api.example.com'

const server = setupServer(
  http.get(`${BASE_URL}/test/success`, () => {
    return HttpResponse.json({
      message: 'ok',
      value: 42
    })
  }),

  http.get(`${BASE_URL}/test/invalid-json`, () => {
    return new HttpResponse('Not valid JSON {{{', {
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.get(`${BASE_URL}/test/api-error`, () => {
    return HttpResponse.json(
      {
        id: 'err-1001',
        code: CommonErrorCodes.INTERNAL,
        message: 'Internal server failure',
        timestamp: 1700000000000,
        details: null
      },
      { status: 500 }
    )
  }),

  http.get(`${BASE_URL}/test/network-error`, () => {
    return HttpResponse.error()
  })
)

describe('HttpClient with MSW Network Server', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const fetchAdapter = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init)

  const client = new HttpClient({
    baseUrl: BASE_URL,
    customFetch: fetchAdapter,
    clientDeviceInfoProvider: {
      getClientDeviceInfo: async () => ({
        client_type: 'web',
        device_id: toClientDeviceIdOrThrow('test-device'),
        device_name: 'Chrome',
        app_version: '1.0.0',
        operation_system_version: '10',
        language: 'en'
      })
    }
  })

  it('handles 200 HTTP success with JSON deserialization', async () => {
    const result = await callResult(async () => client.request<{ message: string; value: number }>('/test/success'))

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toBe('ok')
      expect(result.data.value).toBe(42)
    }
  })

  it('handles HTTP 200 with invalid JSON as SyntaxError contract violation', async () => {
    const result = await callResult(async () => client.request('/test/invalid-json'))

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(ClientCommonErrorCodes.CONTRACT_VIOLATION)
    }
  })

  it('handles 500 structured API Error and translates to ServerError', async () => {
    const result = await callResult(async () => client.request('/test/api-error'))

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(CommonErrorCodes.INTERNAL)
    }
  })

  it('handles network failure (HttpResponse.error) and translates to Network error', async () => {
    const result = await callResult(async () => client.request('/test/network-error'))

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(ClientCommonErrorCodes.NO_INTERNET_CONNECTION)
    }
  })
})
