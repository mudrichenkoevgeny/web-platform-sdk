import { AppError, AppResult, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { GoogleAuthService } from '@/auth/google/GoogleAuthService'
import { IdentifierRepository } from '@/repository/identifier/IdentifierRepository'
import { UserIdentifier } from '@mudrichenkoevgeny/shared-foundation'

/** Google Sign-In flow for associating a Google identity record with current account. */
export class AddUserIdentifierGoogleUseCase {
  /**
   * Constructs a new {@link AddUserIdentifierGoogleUseCase}.
   *
   * @param authService - Google Auth service
   * @param identifierRepository - Identifier repository
   */
  public constructor(
    private readonly authService: GoogleAuthService,
    private readonly identifierRepository: IdentifierRepository
  ) {}

  /**
   * Invokes Google sign-in and links provider token with account.
   *
   * @returns UserIdentifier or AppError
   */
  public async execute(): Promise<AppResult<UserIdentifier, AppError>> {
    const signInResult = await this.authService.signIn()
    if (!isSuccess(signInResult)) {
      return signInResult
    }

    return this.identifierRepository.addUserIdentifierExternalAuthProvider(
      UserAuthProvider.GOOGLE,
      signInResult.data
    )
  }
}
