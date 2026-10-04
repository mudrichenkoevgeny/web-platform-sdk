import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserIdentifierId } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

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
   * @returns UserIdentifier or AppError
   */
  public async execute(userIdentifierId: UserIdentifierId): Promise<AppResult<UserIdentifier, AppError>> {
    return this.identifierRepository.getUserIdentifier(userIdentifierId)
  }
}
