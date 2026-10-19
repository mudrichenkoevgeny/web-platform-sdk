import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'

/** Deletes password credentials for a given user identifier. */
export class DeletePasswordUseCase {
  /**
   * Constructs a new {@link DeletePasswordUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Deletes password for the specified identifier.
   *
   * @param userIdentifierId - Target identifier ID
   * @returns AppResult success or AppError
   */
  public async execute(
    userIdentifierId: UserIdentifierId
  ): Promise<AppResult<void, AppError>> {
    return this.identifierRepository.deletePassword(userIdentifierId)
  }
}
