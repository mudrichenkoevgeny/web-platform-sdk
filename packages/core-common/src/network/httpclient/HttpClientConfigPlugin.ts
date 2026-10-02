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
   * @returns Modified response or original response
   */
  onResponse?(response: Response): Promise<Response> | Response
}
