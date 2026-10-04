import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSecurityRepository } from '@/repository/user/security/UserSecurityRepository'
import { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'

/** Retrieves active backup recovery codes for current account. */
export class GetRecoveryCodesUseCase {
  /**
   * Constructs a new {@link GetRecoveryCodesUseCase}.
   *
   * @param userSecurityRepository - Security management repository
   */
  public constructor(private readonly userSecurityRepository: UserSecurityRepository) {}

  /**
   * Gets recovery codes.
   *
   * @returns TotpRecoveryCodes or AppError
   */
  public async execute(): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.userSecurityRepository.getRecoveryCodes()
  }
}
