/** Callback function signature for observing access token updates. */
export type AccessTokenChangeListener = (token: string | null) => void

/**
 * Interface for retrieving and observing the user's network access token.
 */
export interface AccessTokenProvider {
  /**
   * Retrieves the current access token.
   *
   * @returns Current access token string or null if unauthenticated
   */
  getAccessToken(): string | null

  /**
   * Registers an observer for access token changes.
   *
   * @param listener - Callback function triggered on token update
   * @returns Unsubscribe cleanup function
   */
  observeAccessToken(listener: AccessTokenChangeListener): () => void
}
