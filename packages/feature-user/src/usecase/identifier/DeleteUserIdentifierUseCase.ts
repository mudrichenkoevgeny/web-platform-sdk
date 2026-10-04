import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'

/** Removes an existing identifier from current user profile. */
export class DeleteUserIdentifierUseCase {
  /**
   * Constructs a new {@link DeleteUserIdentifierUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Deletes target identifier.
   *
   * @param identifierId - Target identifier ID
   * @returns AppResult success or AppError
   */
  public async execute(identifierId: UserIdentifierId): Promise<AppResult<void, AppError>> {
    return this.identifierRepository.deleteUserIdentifier(identifierId)
  }
}
