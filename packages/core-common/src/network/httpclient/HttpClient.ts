import { apiErrorResponseSchema, ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'
import { DeviceInfoProvider } from '../../platform/deviceinfo/DeviceInfoProvider'
import { CommonHttpHeaders } from '../contract/CommonHttpHeaders'
import { HttpClientConfigPlugin } from './HttpClientConfigPlugin'
import { ApiException } from '../../error/model/ApiException'
import { generateErrorId } from '../../error/model/ErrorId'

/** Configuration options for {@link HttpClient}. */
export interface HttpClientConfig {
  /** Target API base URL. */
  baseUrl: string
  /** Provider for device headers metadata. */
  deviceInfoProvider: DeviceInfoProvider
  /** Optional HTTP plugins. */
  plugins?: HttpClientConfigPlugin[]
  /** Optional custom fetch function implementation. */
  customFetch?: typeof fetch
  /** Optional diagnostic log callback. */
  logger?: (msg: string) => void
}

/**
 * Fetch network client executing REST requests with automatic headers, plugins, and error schema validation.
 */
export class HttpClient {
  private readonly baseUrl: string
  private readonly deviceInfoProvider: DeviceInfoProvider
  private readonly plugins: HttpClientConfigPlugin[]
  private readonly fetchImpl: typeof fetch
  private readonly logger?: (msg: string) => void

  /**
   * Constructs a new {@link HttpClient}.
   *
   * @param config - Configuration options for the client
   */
  public constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl
    this.deviceInfoProvider = config.deviceInfoProvider
    this.plugins = config.plugins ?? []
    this.fetchImpl = config.customFetch ?? (typeof fetch !== 'undefined' ? fetch.bind(window) : fetch)
    this.logger = config.logger
  }

  /**
   * Dispatches an HTTP request to the specified endpoint path.
   *
   * @param path - Relative endpoint path or absolute URL
   * @param init - Request options
   * @returns Deserialized response payload
   * @throws {@link ApiException} if the server returns a structured error payload
   * @throws Error on non-2xx HTTP responses or fetch network failures
   */
  public async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const fullUrl = path.startsWith('http://') || path.startsWith('https://')
      ? path
      : `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`

    const deviceInfo = await this.deviceInfoProvider.getDeviceInfo()
    const traceId = generateErrorId()

    const headers = new Headers(init.headers)
    headers.set(CommonHttpHeaders.TRACE_HEADER_NAME, traceId)

    if (deviceInfo.client_type) {
      headers.set(CommonHttpHeaders.CLIENT_TYPE_HEADER_NAME, deviceInfo.client_type)
    }
    if (deviceInfo.device_id) {
      headers.set(CommonHttpHeaders.DEVICE_ID_HEADER_NAME, deviceInfo.device_id)
    }
    if (deviceInfo.device_name) {
      headers.set(CommonHttpHeaders.DEVICE_NAME_HEADER_NAME, deviceInfo.device_name)
    }
    if (deviceInfo.app_version) {
      headers.set(CommonHttpHeaders.APP_VERSION_HEADER_NAME, deviceInfo.app_version)
    }
    if (deviceInfo.operation_system_version) {
      headers.set(CommonHttpHeaders.OPERATION_SYSTEM_VERSION_HEADER_NAME, deviceInfo.operation_system_version)
    }
    if (deviceInfo.language) {
      headers.set('Accept-Language', deviceInfo.language)
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json')
    }
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json')
    }

    let requestInit: RequestInit = {
      ...init,
      headers
    }

    for (const plugin of this.plugins) {
      if (plugin.onRequest) {
        requestInit = await plugin.onRequest(fullUrl, requestInit)
      }
    }

    this.logger?.(`HTTP ${requestInit.method ?? 'GET'} ${fullUrl}`)

    let response = await this.fetchImpl(fullUrl, requestInit)

    for (const plugin of this.plugins) {
      if (plugin.onResponse) {
        response = await plugin.onResponse(response)
      }
    }

    if (!response.ok) {
      let apiErrorResponse: ApiErrorResponse | null = null
      try {
        const jsonText = await response.text()
        const parsedJson = JSON.parse(jsonText)
        const parseResult = apiErrorResponseSchema.safeParse(parsedJson)
        if (parseResult.success) {
          apiErrorResponse = parseResult.data
        }
      } catch {
        this.logger?.(`Response validator: Failed to parse error response from ${fullUrl}`)
      }

      if (apiErrorResponse) {
        this.logger?.(`Response validator: API Error [Code: ${apiErrorResponse.code}] at ${fullUrl}. ID: ${apiErrorResponse.id}`)
        throw new ApiException(apiErrorResponse)
      }

      this.logger?.(`Response validator: Generic HTTP Error [${response.status}] at ${fullUrl}`)
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    if (response.status === 204) {
      return undefined as unknown as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as unknown as T
    }

    return JSON.parse(text) as T
  }
}
