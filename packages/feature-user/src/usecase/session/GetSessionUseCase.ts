import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import { SessionRepository } from '@/repository/session/SessionRepository'
import { UserSession } from '@mudrichenkoevgeny/shared-foundation'

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
   * @returns UserSession or AppError
   */
  public async execute(userSessionId: UserSessionId): Promise<AppResult<UserSession, AppError>> {
    return this.sessionRepository.getSession(userSessionId)
  }
}
