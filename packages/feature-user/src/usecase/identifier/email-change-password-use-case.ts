import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'

/** Updates account password using current credentials. */
export class EmailChangePasswordUseCase {
  /**
   * Constructs a new {@link EmailChangePasswordUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Changes email account password.
   *
   * @param userIdentifierId - Target identifier ID
   * @param oldPassword - Current password
   * @param newPassword - New target password
   * @returns AppResult success or AppError
   */
  public async execute(
    userIdentifierId: UserIdentifierId,
    oldPassword: string,
    newPassword: string
  ): Promise<AppResult<void, AppError>> {
    return this.identifierRepository.emailChangePassword(userIdentifierId, oldPassword, newPassword)
  }
}
