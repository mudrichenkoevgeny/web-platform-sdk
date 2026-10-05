import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Administratively deletes a specific session for the given user. */
export class ManagementDeleteSessionUseCase {
  /**
   * Constructs a new {@link ManagementDeleteSessionUseCase}.
   *
   * @param managementSessionRepository - Administrative session management repository
   */
  public constructor(private readonly managementSessionRepository: ManagementSessionRepository) {}

  /**
   * Executes the use case.
   *
   * @param userId - Unique identifier of the session owner
   * @param sessionId - Unique session identifier to revoke
   * @returns Void result or a mapped failure
   */
  public async execute(userId: UserId, sessionId: string): Promise<AppResult<void, AppError>> {
    return this.managementSessionRepository.deleteSession(userId, sessionId)
  }
}
