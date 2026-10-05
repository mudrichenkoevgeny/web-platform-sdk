import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import type { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/** Associates a new phone number identifier with current account. */
export class AddUserIdentifierPhoneUseCase {
  /**
   * Constructs a new {@link AddUserIdentifierPhoneUseCase}.
   *
   * @param identifierRepository - Identifier repository
   */
  public constructor(private readonly identifierRepository: IdentifierRepository) {}

  /**
   * Adds phone identifier.
   *
   * @param phoneNumber - Target phone
   * @param confirmationCode - One-time code sent to phone
   * @returns UserIdentifier or AppError
   */
  public async execute(
    phoneNumber: string,
    confirmationCode: string
  ): Promise<AppResult<UserIdentifier, AppError>> {
    return this.identifierRepository.addUserIdentifierPhone(phoneNumber, confirmationCode)
  }
}
