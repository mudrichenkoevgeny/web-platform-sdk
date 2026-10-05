import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UnlockRepository } from '@/repository/auth/unlock/unlock-repository'

/** Unlocks an account using an external authentication provider token. */
export class UnlockByExternalAuthProviderUseCase {
  /**
   * Constructs a new {@link UnlockByExternalAuthProviderUseCase}.
   *
   * @param unlockRepository - Account unlock repository
   */
  public constructor(private readonly unlockRepository: UnlockRepository) {}

  /**
   * Unlocks account via external provider token.
   *
   * @param authProvider - External provider name
   * @param externalProviderToken - OAuth token
   * @returns AppResult success or AppError
   */
  public async execute(authProvider: string, externalProviderToken: string): Promise<AppResult<void, AppError>> {
    return this.unlockRepository.unlockByExternalAuthProvider(authProvider, externalProviderToken)
  }
}
