import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { AuthData } from '@mudrichenkoevgeny/shared-foundation'
import type { OtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Unified sign-in entry points for both client and management applications.
 */
export interface LoginRepository {
  /** Authenticates with email and password. */
  loginByEmail(email: string, password: string): Promise<AppResult<AuthData, AppError>>

  /** Completes phone login using phoneNumber and confirmationCode. */
  loginByPhone(phoneNumber: string, confirmationCode: string): Promise<AppResult<AuthData, AppError>>

  /** Signs in via an external authProvider using identity externalProviderToken. */
  loginByExternalAuthProvider(
    authProvider: UserAuthProvider,
    externalProviderToken: string
  ): Promise<AppResult<AuthData, AppError>>

  /** Completes the MFA flow using a TOTP code. */
  loginByTotp(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>>

  /** Completes the MFA flow using a static backup recovery code. */
  loginByTotpRecoveryCode(mfaToken: string, code: string): Promise<AppResult<AuthData, AppError>>

  /** Sends a login confirmation code to phoneNumber. */
  sendLoginConfirmationToPhone(phoneNumber: string): Promise<AppResult<OtpConfirmation, AppError>>

  /** Returns the remaining client-side cooldown in seconds for phoneNumber. */
  getRemainingLoginConfirmationDelayInSeconds(phoneNumber: string): number
}
