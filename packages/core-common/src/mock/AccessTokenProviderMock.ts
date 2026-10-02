import { AccessTokenProvider, AccessTokenChangeListener } from '../network/provider/AccessTokenProvider'

export class AccessTokenProviderMock implements AccessTokenProvider {
  private currentToken: string | null = null
  private readonly listeners = new Set<AccessTokenChangeListener>()

  public constructor(initialToken: string | null = null) {
    this.currentToken = initialToken
  }

  public getAccessToken(): string | null {
    return this.currentToken
  }

  public setAccessToken(token: string | null): void {
    this.currentToken = token
    for (const listener of this.listeners) {
      listener(token)
    }
  }

  public observeAccessToken(listener: AccessTokenChangeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}
