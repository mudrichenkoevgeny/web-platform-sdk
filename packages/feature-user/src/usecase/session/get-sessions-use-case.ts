import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  SelfSessionListParams,
  UserSessionSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'

/** Returns a paginated and filtered list of active sessions for current account. */
export class GetSessionsUseCase {
  /**
   * Constructs a new {@link GetSessionsUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Fetches active sessions list.
   *
   * @param params - Query and filter parameters
   * @returns PagedResult containing UserSessionSummary models or AppError
   */
  public async execute(
    params?: SelfSessionListParams | null
  ): Promise<AppResult<PagedResult<UserSessionSummary>, AppError>> {
    return this.sessionRepository.getSessions(params)
  }
}
