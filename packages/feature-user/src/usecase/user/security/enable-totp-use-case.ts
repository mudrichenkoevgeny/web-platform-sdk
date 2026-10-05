import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSecurityRepository } from '@/repository/user/security/user-security-repository'
import type { TotpRecoveryCodes } from '@mudrichenkoevgeny/shared-foundation'

/** Finalizes and enables TOTP multifactor authentication using verification code. */
export class EnableTotpUseCase {
  /**
   * Constructs a new {@link EnableTotpUseCase}.
   *
   * @param userSecurityRepository - Security management repository
   */
  public constructor(private readonly userSecurityRepository: UserSecurityRepository) {}

  /**
   * Enables TOTP 2FA.
   *
   * @param mfaToken - MFA token
   * @param code - TOTP code
   * @returns TotpRecoveryCodes or AppError
   */
  public async execute(mfaToken: string, code: string): Promise<AppResult<TotpRecoveryCodes, AppError>> {
    return this.userSecurityRepository.enableTotp(mfaToken, code)
  }
}
