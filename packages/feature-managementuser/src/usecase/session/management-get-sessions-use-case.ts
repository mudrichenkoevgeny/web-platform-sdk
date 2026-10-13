import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  ManagementGlobalSessionListParams,
  ManagementUserSessionListParams,
  PagedResult,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Administrative retrieval of user sessions based on filters. */
export class ManagementGetSessionsUseCase {
  /**
   * Constructs a new {@link ManagementGetSessionsUseCase}.
   *
   * @param managementSessionRepository - Administrative session management repository
   */
  public constructor(private readonly managementSessionRepository: ManagementSessionRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing matching user session summary models, or a mapped failure
   */
  public async execute(
    params?: ManagementGlobalSessionListParams | ManagementUserSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.managementSessionRepository.getSessions(params)
  }
}
