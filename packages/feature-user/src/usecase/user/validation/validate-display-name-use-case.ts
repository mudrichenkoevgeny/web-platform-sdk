import { isSuccess, appResultSuccess, appResultFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { displayNameValidator, UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { GetAuthSettingsUseCase } from '@/usecase/auth/settings/get-auth-settings-use-case'
import { UserError } from '@/error/model/user-error'

/**
 * Validates a user's display name against remote authentication settings constraints and character rules.
 */
export class ValidateDisplayNameUseCase {
  /**
   * Constructs a new {@link ValidateDisplayNameUseCase}.
   *
   * @param getAuthSettingsUseCase - Use case to retrieve current public auth settings
   */
  public constructor(private readonly getAuthSettingsUseCase: GetAuthSettingsUseCase) {}

  /**
   * Validates newDisplayName against constraints.
   *
   * @param newDisplayName - The target display name input
   * @returns Void AppResult on success, or AppResult.Error wrapping {@link UserError} on failure
   */
  public async execute(newDisplayName: string): Promise<AppResult<void, AppError>> {
    const authSettingsResult = await this.getAuthSettingsUseCase.execute()
    if (!isSuccess(authSettingsResult)) {
      return authSettingsResult
    }

    const authSettings = authSettingsResult.data
    const minLength = authSettings.userDisplayNameMinLength
    const maxLength = authSettings.userDisplayNameMaxLength

    const validationResult = displayNameValidator.validate(
      newDisplayName,
      minLength,
      maxLength
    )

    if (validationResult !== null) {
      let error: AppError
      switch (validationResult) {
        case UserErrorCodes.DISPLAY_NAME_TOO_SHORT:
          error = UserError.displayNameTooShort(minLength)
          break
        case UserErrorCodes.DISPLAY_NAME_TOO_LONG:
          error = UserError.displayNameTooLong(maxLength)
          break
        case UserErrorCodes.INVALID_DISPLAY_NAME_CHARACTERS:
        default:
          error = UserError.invalidDisplayNameCharacters()
          break
      }
      return appResultFailure(error)
    }

    return appResultSuccess(undefined)
  }
}
