import type { AccessTokenChangeListener } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  UserIdentifierId,
  UserSessionId
} from '@mudrichenkoevgeny/shared-foundation'
import { AuthStorage } from '@/storage/auth/AuthStorage'
import type { AccessToken, RefreshToken, SessionToken } from '@mudrichenkoevgeny/shared-foundation'

/**
 * In-memory {@link AuthStorage} mock for tests and previews.
 */
export class AuthStorageMock implements AuthStorage {
  private accessToken: AccessToken | null = null
  private refreshToken: RefreshToken | null = null
  private expiresAt = 0
  private sessionId: UserSessionId | null = null
  private identifierId: UserIdentifierId | null = null
  private readonly listeners = new Set<AccessTokenChangeListener>()

  public isTokensCleared = false

  public getAccessToken(): string | null {
    return this.accessToken ?? null
  }

  public observeAccessToken(listener: AccessTokenChangeListener): () => void {
    this.listeners.add(listener)
    listener(this.getAccessToken())
    return () => {
      this.listeners.delete(listener)
    }
  }

  public async getAccessTokenModel(): Promise<AccessToken | null> {
    return this.accessToken
  }

  public async getRefreshToken(): Promise<RefreshToken | null> {
    return this.refreshToken
  }

  public async getExpiresAt(): Promise<number> {
    return this.expiresAt
  }

  public async getSessionId(): Promise<UserSessionId | null> {
    return this.sessionId
  }

  public async getIdentifierId(): Promise<UserIdentifierId | null> {
    return this.identifierId
  }

  public async updateTokens(sessionToken: SessionToken): Promise<void> {
    this.accessToken = sessionToken.accessToken
    this.refreshToken = sessionToken.refreshToken
    this.expiresAt = sessionToken.expiresAt
    this.sessionId = sessionToken.sessionId
    this.identifierId = sessionToken.identifierId
    this.isTokensCleared = false
    this.notifyListeners()
  }

  public async clearTokens(): Promise<void> {
    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = 0
    this.sessionId = null
    this.identifierId = null
    this.isTokensCleared = true
    this.notifyListeners()
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.getAccessToken())
    }
  }
}
