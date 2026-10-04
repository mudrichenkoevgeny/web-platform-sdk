import { AppError, AppResult, appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionRepository } from '@/repository/session/SessionRepository'
import { UserRepository } from '@/repository/user/UserRepository'

/**
 * Ends active session on server and clears local user session regardless of network outcome.
 */
export class LogoutUseCase {
  /**
   * Constructs a new {@link LogoutUseCase}.
   *
   * @param sessionRepository - Remote session repository
   * @param userRepository - User repository for clearing local session
   */
  public constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Clears local session and returns success.
   *
   * @returns Success indicator
   */
  public async execute(): Promise<AppResult<void, AppError>> {
    try {
      await this.sessionRepository.logout()
    } catch {
      // Remote logout errors are ignored
    } finally {
      await this.userRepository.clearSession()
    }
    return appResultSuccess(undefined)
  }
}
