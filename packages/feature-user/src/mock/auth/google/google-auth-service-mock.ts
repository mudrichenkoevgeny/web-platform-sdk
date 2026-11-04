import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestLoginByExternalAuthProviderRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { LoginByExternalAuthProviderRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { GoogleAuthService } from '@/auth/google/google-auth-service'

/**
 * Deterministic {@link GoogleAuthService} mock for tests and previews.
 */
export class GoogleAuthServiceMock implements GoogleAuthService {
  public signInResultProvider: () => Promise<AppResult<LoginByExternalAuthProviderRequest, AppError>> = async () =>
    appResultSuccess(createTestLoginByExternalAuthProviderRequest())

  public signOutResultProvider: () => Promise<AppResult<void, AppError>> = async () =>
    appResultSuccess(undefined)

  /**
   * Mocks interactive Google sign-in.
   *
   * @returns Configured AppResult containing LoginByExternalAuthProviderRequest or AppError
   */
  public async signIn(): Promise<AppResult<LoginByExternalAuthProviderRequest, AppError>> {
    return this.signInResultProvider()
  }

  /**
   * Mocks Google sign-out.
   *
   * @returns Configured AppResult unit or AppError
   */
  public async signOut(): Promise<AppResult<void, AppError>> {
    return this.signOutResultProvider()
  }
}
