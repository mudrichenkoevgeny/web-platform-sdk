import { AppError, AppResult, appResultFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GoogleAuthService } from './GoogleAuthService'
import { UserError } from '@/error/model/UserError'

/**
 * No-op Google integration that always fails with {@link UserError.externalAuthFailed}.
 */
export class DisabledGoogleAuthService implements GoogleAuthService {
  private error(): AppResult<string, AppError> {
    return appResultFailure(
      UserError.externalAuthFailed(new Error('Google Auth is not supported'))
    )
  }

  /**
   * Runs sign-in, returning an error result.
   */
  public async signIn(): Promise<AppResult<string, AppError>> {
    return this.error()
  }

  /**
   * Runs sign-out, returning an error result.
   */
  public async signOut(): Promise<AppResult<void, AppError>> {
    return appResultFailure(
      UserError.externalAuthFailed(new Error('Google Auth is not supported'))
    )
  }
}
