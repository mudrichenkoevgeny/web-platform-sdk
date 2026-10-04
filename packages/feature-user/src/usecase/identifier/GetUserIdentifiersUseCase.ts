import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import type { GetUserIdentifiersParams, IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/** Returns a paginated and filtered list of identifiers for current account. */
export class GetUserIdentifiersUseCase {
  /**
   * Constructs a new {@link GetUserIdentifiersUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Fetches user identifiers list.
   *
   * @returns PagedResult containing UserIdentifier models or AppError
   */
  public async execute(params?: GetUserIdentifiersParams): Promise<AppResult<PagedResult<UserIdentifier>, AppError>> {
    return this.identifierRepository.getUserIdentifiers(params)
  }
}
