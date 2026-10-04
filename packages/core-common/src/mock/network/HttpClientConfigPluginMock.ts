import { HttpClientConfigPlugin } from '@/network/httpclient/HttpClientConfigPlugin'

/**
 * Mock implementation of {@link HttpClientConfigPlugin} for inspecting or mutating HTTP requests and responses during tests.
 */
export class HttpClientConfigPluginMock implements HttpClientConfigPlugin {
  public onRequestCallCount = 0
  public onResponseCallCount = 0
  public lastRequestUrl: string | null = null
  public lastRequestInit: RequestInit | null = null
  public lastResponse: Response | null = null

  public onRequestCustomHandler?: (url: string, init: RequestInit) => Promise<RequestInit> | RequestInit
  public onResponseCustomHandler?: (response: Response) => Promise<Response> | Response

  /**
   * Intercepts and logs an outgoing HTTP request before execution.
   *
   * @param url - Full target URL of the HTTP request
   * @param init - Request options
   * @returns Mutated or original request options
   */
  public async onRequest(url: string, init: RequestInit): Promise<RequestInit> {
    this.onRequestCallCount++
    this.lastRequestUrl = url
    this.lastRequestInit = init
    if (this.onRequestCustomHandler) {
      return this.onRequestCustomHandler(url, init)
    }
    return init
  }

  /**
   * Intercepts and logs an incoming HTTP response.
   *
   * @param response - Received fetch response object
   * @returns Mutated or original response object
   */
  public async onResponse(response: Response): Promise<Response> {
    this.onResponseCallCount++
    this.lastResponse = response
    if (this.onResponseCustomHandler) {
      return this.onResponseCustomHandler(response)
    }
    return response
  }
}
