import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalIdentifierListParams,
  ManagementUserIdentifierListParams,
  PagedResult,
  UserIdentifierSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementIdentifierRepository } from '@/repository/identifier/management-identifier-repository'

/** Administrative retrieval of user identity identifiers based on filters. */
export class ManagementGetIdentifiersUseCase {
  /**
   * Constructs a new {@link ManagementGetIdentifiersUseCase}.
   *
   * @param managementIdentifierRepository - Administrative identifier management repository
   */
  public constructor(private readonly managementIdentifierRepository: ManagementIdentifierRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing matching user identifier summary models, or a mapped failure
   */
  public async execute(
    params?: ManagementGlobalIdentifierListParams | ManagementUserIdentifierListParams | null
  ): Promise<AppResult<PagedResult<UserIdentifierSummary>, AppError>> {
    return this.managementIdentifierRepository.getIdentifiers(params)
  }
}
