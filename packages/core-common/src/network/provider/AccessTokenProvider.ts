export type AccessTokenChangeListener = (token: string | null) => void

export interface AccessTokenProvider {
  getAccessToken(): string | null
  observeAccessToken(listener: AccessTokenChangeListener): () => void
}
