import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionRepository } from '@/repository/session/SessionRepository'

/** Deletes all sessions for current authenticated account except the one used for this request. */
export class DeleteAllOtherSessionsUseCase {
  /**
   * Constructs a new {@link DeleteAllOtherSessionsUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Revokes all other sessions.
   *
   * @returns AppResult success or AppError
   */
  public async execute(): Promise<AppResult<void, AppError>> {
    return this.sessionRepository.deleteAllOtherSessions()
  }
}
