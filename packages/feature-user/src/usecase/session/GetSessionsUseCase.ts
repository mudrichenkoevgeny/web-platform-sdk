import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import type { GetSessionsParams, SessionRepository } from '@/repository/session/SessionRepository'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'

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
   * @returns PagedResult containing UserSession models or AppError
   */
  public async execute(params?: GetSessionsParams): Promise<AppResult<PagedResult<UserSession>, AppError>> {
    return this.sessionRepository.getSessions(params)
  }
}
