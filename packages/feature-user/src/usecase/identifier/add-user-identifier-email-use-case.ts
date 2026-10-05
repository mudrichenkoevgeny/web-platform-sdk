import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { IdentifierRepository } from '@/repository/identifier/identifier-repository'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/** Associates a new email identifier with current account. */
export class AddUserIdentifierEmailUseCase {
  /**
   * Constructs a new {@link AddUserIdentifierEmailUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Adds email identifier.
   *
   * @param email - Target email
   * @param password - Account password for verification
   * @param confirmationCode - One-time code sent to email
   * @returns UserIdentifier or AppError
   */
  public async execute(
    email: string,
    password: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    return this.identifierRepository.addUserIdentifierEmail(email, password, confirmationCode)
  }
}
