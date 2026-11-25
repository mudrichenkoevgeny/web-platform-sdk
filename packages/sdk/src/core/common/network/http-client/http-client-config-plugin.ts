/**
 * Plugin interface for intercepting and modifying HTTP requests and responses in {@link HttpClient}.
 */
export interface HttpClientConfigPlugin {
  /**
   * Hook invoked prior to dispatching an HTTP request.
   *
   * @param url - Request target URL
   * @param init - Request options
   * @returns Modified request options or original init
   */
  onRequest?(url: string, init: RequestInit): Promise<RequestInit> | RequestInit

  /**
   * Hook invoked after receiving an HTTP response.
   *
   * @param response - Received HTTP response
   * @param url - Optional request target URL
   * @param init - Optional request options
   * @param fetchImpl - Optional fetch implementation function
   * @returns Modified response or original response
   */
  onResponse?(
    response: Response,
    url?: string,
    init?: RequestInit,
    fetchImpl?: typeof fetch
  ): Promise<Response> | Response
}
