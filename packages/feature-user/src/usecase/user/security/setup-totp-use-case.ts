import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSecurityRepository } from '@/repository/user/security/user-security-repository'
import type { TotpSetup } from '@mudrichenkoevgeny/shared-foundation'

/** Initiates TOTP setup process by generating secret key and configuration URI. */
export class SetupTotpUseCase {
  /**
   * Constructs a new {@link SetupTotpUseCase}.
   *
   * @param userSecurityRepository - Security management repository
   */
  public constructor(private readonly userSecurityRepository: UserSecurityRepository) {}

  /**
   * Generates secret key and setup data.
   *
   * @returns TotpSetup or AppError
   */
  public async execute(): Promise<AppResult<TotpSetup, AppError>> {
    return this.userSecurityRepository.setupTotp()
  }
}
