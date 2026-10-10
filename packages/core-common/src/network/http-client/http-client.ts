import { apiErrorResponseSchema } from '@mudrichenkoevgeny/shared-foundation'
import type { ApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import { CommonHttpHeaders } from '@/network/contract/common-http-headers'
import type { HttpClientConfigPlugin } from '@/network/http-client/http-client-config-plugin'
import { ApiException } from '@/error/model/api-exception'
import { generateErrorId } from '@/error/model/error-id'

/** Configuration options for {@link HttpClient}. */
export interface HttpClientConfig {
  /** Target API base URL. */
  baseUrl: string
  /** Provider for device headers metadata. */
  clientDeviceInfoProvider: ClientDeviceInfoProvider
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
  private readonly clientDeviceInfoProvider: ClientDeviceInfoProvider
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
    this.clientDeviceInfoProvider = config.clientDeviceInfoProvider
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

    const clientDeviceInfo = await this.clientDeviceInfoProvider.getClientDeviceInfo()
    const traceId = generateErrorId()

    const headers = new Headers(init.headers)
    headers.set(CommonHttpHeaders.TRACE_HEADER_NAME, traceId)

    if (clientDeviceInfo.client_type) {
      headers.set(CommonHttpHeaders.CLIENT_TYPE_HEADER_NAME, clientDeviceInfo.client_type)
    }
    if (clientDeviceInfo.device_id) {
      headers.set(CommonHttpHeaders.DEVICE_ID_HEADER_NAME, clientDeviceInfo.device_id)
    }
    if (clientDeviceInfo.device_name) {
      headers.set(CommonHttpHeaders.DEVICE_NAME_HEADER_NAME, clientDeviceInfo.device_name)
    }
    if (clientDeviceInfo.app_version) {
      headers.set(CommonHttpHeaders.APP_VERSION_HEADER_NAME, clientDeviceInfo.app_version)
    }
    if (clientDeviceInfo.operation_system_version) {
      headers.set(CommonHttpHeaders.OPERATION_SYSTEM_VERSION_HEADER_NAME, clientDeviceInfo.operation_system_version)
    }
    if (clientDeviceInfo.language) {
      headers.set('Accept-Language', clientDeviceInfo.language)
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
        response = await plugin.onResponse(response, fullUrl, requestInit, this.fetchImpl)
      }
    }

    if (!response.ok) {
      let apiErrorResponse: ApiErrorResponse | null = null
      try {
        const jsonText = await response.text()
        if (jsonText && jsonText.trim().length > 0) {
          const parsedJson = JSON.parse(jsonText)
          const parseResult = apiErrorResponseSchema.safeParse(parsedJson)
          if (parseResult.success) {
            apiErrorResponse = parseResult.data
          }
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
      return undefined as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as T
    }

    return JSON.parse(text) as T
  }
}
