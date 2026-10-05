import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementUserSecurityRepository } from '@/repository/user/security/management-user-security-repository'

/** Administratively disables TOTP (2FA) for a specific user. */
export class ManagementDisableTotpUseCase {
  /**
   * Constructs a new {@link ManagementDisableTotpUseCase}.
   *
   * @param managementUserSecurityRepository - Administrative security management repository
   */
  public constructor(
    private readonly managementUserSecurityRepository: ManagementUserSecurityRepository
  ) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique identifier of the target user
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementUserSecurityRepository.disableTotp(userId)
  }
}
