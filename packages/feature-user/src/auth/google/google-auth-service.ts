import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { LoginByExternalAuthProviderRequest } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Cross-platform contract for Google Sign-In used by user login flows.
 */
export interface GoogleAuthService {
  /**
   * Runs interactive Google sign-in and returns a backend-ready credential request payload.
   *
   * @returns Success with LoginByExternalAuthProviderRequest or error AppResult
   */
  signIn(): Promise<AppResult<LoginByExternalAuthProviderRequest, AppError>>

  /**
   * Clears on-device Google session state.
   *
   * @returns Success on clean sign-out or error AppResult
   */
  signOut(): Promise<AppResult<void, AppError>>
}
