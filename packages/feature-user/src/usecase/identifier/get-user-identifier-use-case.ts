import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierId, UserIdentifierPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'

/** Retrieves specific identifier details by its unique id for current account. */
export class GetUserIdentifierUseCase {
  /**
   * Constructs a new {@link GetUserIdentifierUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Retrieves single identifier.
   *
   * @param userIdentifierId - Identifier ID
   * @returns UserIdentifierPrivate or AppError
   */
  public async execute(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifierPrivate, AppError>> {
    return this.identifierRepository.getUserIdentifier(userIdentifierId)
  }
}
