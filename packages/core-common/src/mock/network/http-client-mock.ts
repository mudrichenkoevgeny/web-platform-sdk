import { vi } from 'vitest'
import type { Mock } from 'vitest'
import { HttpClient } from '@/network/http-client/http-client'

/** Mock implementation of {@link HttpClient} for unit testing. */
export class HttpClientMock extends HttpClient {
  public override request: Mock<[path: string, init?: RequestInit], Promise<unknown>>

  public constructor() {
    super({
      baseUrl: 'https://api.example.com',
      clientDeviceInfoProvider: {
        getClientDeviceInfo: async () => ({
          client_type: 'WEB',
          device_id: 'device_123',
          device_name: 'Test Device',
          app_version: '1.0.0',
          operation_system_version: '1.0.0',
          language: 'en'
        })
      }
    })
    this.request = vi.fn()
  }
}
