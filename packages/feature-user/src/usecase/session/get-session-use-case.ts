import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionId, UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'

/** Returns details of a specific session owned by current account. */
export class GetSessionUseCase {
  /**
   * Constructs a new {@link GetSessionUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Retrieves single session.
   *
   * @param userSessionId - Target session ID
   * @returns UserSessionPrivate or AppError
   */
  public async execute(userSessionId: UserSessionId): Promise<AppResult<UserSessionPrivate, AppError>> {
    return this.sessionRepository.getSession(userSessionId)
  }
}
