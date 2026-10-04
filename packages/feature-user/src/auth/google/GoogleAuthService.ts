import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Cross-platform contract for Google Sign-In used by user login flows.
 */
export interface GoogleAuthService {
  /**
   * Runs interactive Google sign-in and returns a backend-ready credential (typically Google ID token string).
   *
   * @returns Success with token string or error AppResult
   */
  signIn(): Promise<AppResult<string, AppError>>

  /**
   * Clears on-device Google session state.
   *
   * @returns Success on clean sign-out or error AppResult
   */
  signOut(): Promise<AppResult<void, AppError>>
}
