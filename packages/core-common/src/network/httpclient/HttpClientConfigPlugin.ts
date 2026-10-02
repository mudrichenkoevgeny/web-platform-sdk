export interface HttpClientConfigPlugin {
  onRequest?(url: string, init: RequestInit): Promise<RequestInit> | RequestInit
  onResponse?(response: Response): Promise<Response> | Response
}
