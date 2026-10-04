import { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionRepository } from '@/repository/session/SessionRepository'

/** Performs re-authentication via TOTP for current session to update its trust level. */
export class ReauthenticateSessionUseCase {
  /**
   * Constructs a new {@link ReauthenticateSessionUseCase}.
   *
   * @param sessionRepository - Session repository
   */
  public constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Reauthenticates session with TOTP code.
   *
   * @param mfaToken - MFA token
   * @param code - TOTP code
   * @returns AppResult success or AppError
   */
  public async execute(mfaToken: string, code: string): Promise<AppResult<void, AppError>> {
    return this.sessionRepository.reauthenticateSession(mfaToken, code)
  }
}
