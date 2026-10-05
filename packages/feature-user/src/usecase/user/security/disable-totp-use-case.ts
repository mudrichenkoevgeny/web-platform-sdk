import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSecurityRepository } from '@/repository/user/security/UserSecurityRepository'

/** Disables TOTP multifactor authentication for current account. */
export class DisableTotpUseCase {
  /**
   * Constructs a new {@link DisableTotpUseCase}.
   *
   * @param userSecurityRepository - Security management repository
   */
  public constructor(private readonly userSecurityRepository: UserSecurityRepository) {}

  /**
   * Disables TOTP 2FA.
   *
   * @returns AppResult success or AppError
   */
  public async execute(): Promise<AppResult<void, AppError>> {
    return this.userSecurityRepository.disableTotp()
  }
}
