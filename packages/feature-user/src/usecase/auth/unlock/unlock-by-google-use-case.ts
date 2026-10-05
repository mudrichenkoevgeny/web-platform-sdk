import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from "@mudrichenkoevgeny/web-platform-sdk-core-common";
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { GoogleAuthService } from '@/auth/google/GoogleAuthService'
import type { UnlockRepository } from '@/repository/auth/unlock/UnlockRepository'
/**
 * Google unlock flow: obtains Google ID credential token via GoogleAuthService,
 * then submits it to UnlockRepository to unlock the account.
 */
export class UnlockByGoogleUseCase {
  /**
   * Constructs a new {@link UnlockByGoogleUseCase}.
   *
   * @param authService - Platform Google auth helper
   * @param unlockRepository - Account unlock repository
   */
  public constructor(
    private readonly authService: GoogleAuthService,
    private readonly unlockRepository: UnlockRepository
  ) {}

  /**
   * Executes Google sign-in and unlocks account using received token.
   *
   * @returns AppResult success or AppError
   */
  public async execute(): Promise<AppResult<void, AppError>> {
    const result = await this.authService.signIn()
    if (!isSuccess(result)) {
      return result
    }

    return this.unlockRepository.unlockByExternalAuthProvider(
      UserAuthProvider.GOOGLE,
      result.data
    )
  }
}
