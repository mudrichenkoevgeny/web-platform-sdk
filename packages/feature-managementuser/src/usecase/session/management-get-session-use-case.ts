import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementSessionRepository } from '@/repository/session/management-session-repository'

/** Administratively retrieves specific session details. */
export class ManagementGetSessionUseCase {
  /**
   * Constructs a new {@link ManagementGetSessionUseCase}.
   *
   * @param managementSessionRepository - Administrative session management repository
   */
  public constructor(private readonly managementSessionRepository: ManagementSessionRepository) {}

  /**
   * Executes the use case.
   *
   * @param sessionId - Unique session identifier
   * @returns Detailed information of the target session model, or a mapped failure
   */
  public async execute(sessionId: string): Promise<AppResult<UserSession, AppError>> {
    return this.managementSessionRepository.getSession(sessionId)
  }
}
