import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionId } from '@mudrichenkoevgeny/shared-foundation'
import type { SessionRepository } from '@/repository/session/session-repository'

/** Deletes a specific active session for current account. */
export class DeleteSessionUseCase {
  /**
   * Constructs a new {@link DeleteSessionUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Revokes target session.
   *
   * @param userSessionId - Target session ID
   * @returns AppResult success or AppError
   */
  public async execute(userSessionId: UserSessionId): Promise<AppResult<void, AppError>> {
    return this.sessionRepository.deleteSession(userSessionId)
  }
}
