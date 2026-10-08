import type { AccessTokenProvider } from '@/network/provider/access-token-provider'
import type { AccessTokenChangeListener } from '@/network/provider/access-token-provider'

/**
 * Mock implementation of {@link AccessTokenProvider} for testing authentication state handling.
 */
export class AccessTokenProviderMock implements AccessTokenProvider {
  private currentToken: string | null = null
  private readonly listeners = new Set<AccessTokenChangeListener>()

  /**
   * Initializes a new instance of {@link AccessTokenProviderMock}.
   *
   * @param initialToken - Initial access token string or null
   */
  public constructor(initialToken: string | null = null) {
    this.currentToken = initialToken
  }

  /**
   * Retrieves the current access token.
   *
   * @returns Current access token or null
   */
  public getAccessToken(): string | null {
    return this.currentToken
  }

  /**
   * Updates the access token and notifies all registered observers.
   *
   * @param token - New access token or null
   */
  public setAccessToken(token: string | null): void {
    this.currentToken = token
    for (const listener of this.listeners) {
      listener(token)
    }
  }

  /**
   * Registers an observer for access token changes.
   *
   * @param listener - Function invoked when the token changes
   * @returns Unsubscribe function to remove the listener
   */
  public observeAccessToken(listener: AccessTokenChangeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}
