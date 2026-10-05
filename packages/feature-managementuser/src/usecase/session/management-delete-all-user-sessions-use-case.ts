import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Administratively deletes all active sessions for the specified user. */
export class ManagementDeleteAllUserSessionsUseCase {
  /**
   * Constructs a new {@link ManagementDeleteAllUserSessionsUseCase}.
   *
   * @param managementSessionRepository - Administrative session management repository
   */
  public constructor(private readonly managementSessionRepository: ManagementSessionRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique identifier of the target account
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId): Promise<AppResult<void, AppError>> {
    return this.managementSessionRepository.deleteAllUserSessions(userId)
  }
}
