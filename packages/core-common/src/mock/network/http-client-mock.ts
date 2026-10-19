import { ClientType, CommonLocales, toClientDeviceIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { HttpClient } from '@/network/http-client/http-client'

/** Mock implementation of {@link HttpClient} for unit testing. */
export class HttpClientMock extends HttpClient {
  public constructor() {
    super({
      baseUrl: 'https://api.example.com',
      clientDeviceInfoProvider: {
        getClientDeviceInfo: async () => ({
          client_type: ClientType.WEB,
          device_id: toClientDeviceIdOrThrow('device_123'),
          device_name: 'Test Device',
          app_version: '1.0.0',
          operation_system_version: '1.0.0',
          language: CommonLocales.ENGLISH
        })
      }
    })
  }

  public override async request<T>(_path: string, _init?: RequestInit): Promise<T> {
    return {} as T
  }
}
