import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'

/** Open REST API client interface for registering new user accounts. */
export interface OpenRegistrationApi {
  /**
   * Registers a new user account with an email and optional initial password.
   *
   * @param email - User email address
   * @param password - Optional account password
   * @returns AppResult containing new {@link UserPrivatePayload} on success
   */
  registerByEmail(email: string, password?: string | null): Promise<AppResult<UserPrivatePayload, AppError>>
}
