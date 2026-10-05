import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSecurityRepository } from '@/repository/user/security/user-security-repository'
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'

/** Invalidates current recovery codes and generates fresh replacement set. */
export class RegenerateRecoveryCodesUseCase {
  /**
   * Constructs a new {@link RegenerateRecoveryCodesUseCase}.
   *
   * @param userSecurityRepository - Security management repository
   */
  public constructor(private readonly userSecurityRepository: UserSecurityRepository) {}

  /**
   * Regenerates recovery codes.
   *
   * @returns TotpRecoveryCodes or AppError
   */
  public async execute(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.userSecurityRepository.regenerateRecoveryCodes()
  }
}
