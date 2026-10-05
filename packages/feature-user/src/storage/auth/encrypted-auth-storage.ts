import {
  toAccessTokenOrNull,
  toRefreshTokenOrNull,
  toUserIdentifierIdOrNull,
  toUserSessionIdOrNull
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierId, UserSessionId } from "@mudrichenkoevgeny/shared-foundation";
import {
  AccessTokenProvider
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AccessTokenChangeListener, EncryptedSettings } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { AuthStorage } from '@/storage/auth/auth-storage'
import type { AccessToken, RefreshToken, SessionToken } from '@mudrichenkoevgeny/shared-foundation'
const KEY_ACCESS_TOKEN = 'auth_access_token'
const KEY_REFRESH_TOKEN = 'auth_refresh_token'
const KEY_EXPIRES_AT = 'auth_expires_at'
const KEY_SESSION_ID = 'auth_session_id'
const KEY_IDENTIFIER_ID = 'auth_identifier_id'

/**
 * Production {@link AuthStorage} that persists session tokens under encrypted keys and implements {@link AccessTokenProvider}.
 */
export class EncryptedAuthStorage implements AuthStorage, AccessTokenProvider {
  private cachedAccessToken: string | null = null
  private readonly listeners = new Set<AccessTokenChangeListener>()

  /**
   * Constructs a new {@link EncryptedAuthStorage}.
   *
   * @param encryptedSettings - Host-provided encrypted settings instance
   */
  public constructor(private readonly encryptedSettings: EncryptedSettings) {}

  /**
   * Initializes token cache and checks token expiration.
   */
  public async init(): Promise<void> {
    const rawExpiresAt = await this.encryptedSettings.get(KEY_EXPIRES_AT)
    const expiresAt = rawExpiresAt ? Number(rawExpiresAt) : 0
    const now = Date.now()

    if (expiresAt > 0 && expiresAt <= now) {
      await this.clearTokens()
    } else {
      this.cachedAccessToken = await this.encryptedSettings.get(KEY_ACCESS_TOKEN)
    }
  }

  /**
   * Synchronously retrieves the current cached access token string.
   *
   * @returns Access token string or null if unauthenticated
   */
  public getAccessToken(): string | null {
    return this.cachedAccessToken
  }

  /**
   * Registers an observer for access token updates.
   *
   * @param listener - Callback function triggered on token update
   * @returns Unsubscribe cleanup function
   */
  public observeAccessToken(listener: AccessTokenChangeListener): () => void {
    this.listeners.add(listener)
    listener(this.cachedAccessToken)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Retrieves parsed access token domain model.
   *
   * @returns Access token or null if unauthenticated or expired
   */
  public async getAccessTokenModel(): Promise<AccessToken | null> {
    const expiresAt = await this.getExpiresAt()
    const now = Date.now()

    if (expiresAt > 0 && expiresAt <= now) {
      await this.clearTokens()
      return null
    }

    const tokenValue = await this.encryptedSettings.get(KEY_ACCESS_TOKEN)
    return toAccessTokenOrNull(tokenValue)
  }

  /**
   * Retrieves parsed refresh token domain model.
   *
   * @returns Refresh token or null if absent
   */
  public async getRefreshToken(): Promise<RefreshToken | null> {
    const tokenValue = await this.encryptedSettings.get(KEY_REFRESH_TOKEN)
    return toRefreshTokenOrNull(tokenValue)
  }

  /**
   * Retrieves access token expiry epoch timestamp in milliseconds.
   *
   * @returns Expiry epoch milliseconds
   */
  public async getExpiresAt(): Promise<number> {
    const rawExpiresAt = await this.encryptedSettings.get(KEY_EXPIRES_AT)
    return rawExpiresAt ? Number(rawExpiresAt) : 0
  }

  /**
   * Retrieves active session ID.
   *
   * @returns Session ID or null
   */
  public async getSessionId(): Promise<UserSessionId | null> {
    const rawId = await this.encryptedSettings.get(KEY_SESSION_ID)
    return toUserSessionIdOrNull(rawId)
  }

  /**
   * Retrieves credential identifier ID.
   *
   * @returns Identifier ID or null
   */
  public async getIdentifierId(): Promise<UserIdentifierId | null> {
    const rawId = await this.encryptedSettings.get(KEY_IDENTIFIER_ID)
    return toUserIdentifierIdOrNull(rawId)
  }

  /**
   * Persists session tokens and updates in-memory cache and observers.
   *
   * @param sessionToken - Session token details to store
   */
  public async updateTokens(sessionToken: SessionToken): Promise<void> {
    await this.encryptedSettings.put(KEY_ACCESS_TOKEN, sessionToken.accessToken)
    await this.encryptedSettings.put(KEY_REFRESH_TOKEN, sessionToken.refreshToken)
    await this.encryptedSettings.put(KEY_EXPIRES_AT, String(sessionToken.expiresAt))
    await this.encryptedSettings.put(KEY_SESSION_ID, sessionToken.sessionId)
    await this.encryptedSettings.put(KEY_IDENTIFIER_ID, sessionToken.identifierId)

    this.cachedAccessToken = sessionToken.accessToken
    this.notifyListeners()
  }

  /**
   * Clears stored tokens and notifies observers.
   */
  public async clearTokens(): Promise<void> {
    await this.encryptedSettings.remove(KEY_ACCESS_TOKEN)
    await this.encryptedSettings.remove(KEY_REFRESH_TOKEN)
    await this.encryptedSettings.remove(KEY_EXPIRES_AT)
    await this.encryptedSettings.remove(KEY_SESSION_ID)
    await this.encryptedSettings.remove(KEY_IDENTIFIER_ID)

    if (this.cachedAccessToken !== null) {
      this.cachedAccessToken = null
      this.notifyListeners()
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.cachedAccessToken)
    }
  }
}
