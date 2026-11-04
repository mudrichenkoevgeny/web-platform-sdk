import { isSuccess, appResultSuccess, appResultFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { nicknameValidator, UserErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import type { GetAuthSettingsUseCase } from '@/usecase/auth/settings/get-auth-settings-use-case'
import { UserError } from '@/error/model/user-error'

/**
 * Validates a user's nickname against remote authentication settings constraints, policy rules, and character set.
 */
export class ValidateNicknameUseCase {
  /**
   * Constructs a new {@link ValidateNicknameUseCase}.
   *
   * @param getAuthSettingsUseCase - Use case to retrieve current public auth settings
   */
  public constructor(private readonly getAuthSettingsUseCase: GetAuthSettingsUseCase) {}

  /**
   * Validates newNickname against constraints and policy.
   *
   * @param newNickname - The target nickname input
   * @param currentNickname - The existing nickname of the user, if any
   * @returns Void AppResult on success, or AppResult.Error wrapping {@link UserError} on failure
   */
  public async execute(newNickname: string, currentNickname?: string | null): Promise<AppResult<void, AppError>> {
    const authSettingsResult = await this.getAuthSettingsUseCase.execute()
    if (!isSuccess(authSettingsResult)) {
      return authSettingsResult
    }

    const authSettings = authSettingsResult.data
    const minLength = authSettings.userNicknameMinLength
    const maxLength = authSettings.userNicknameMaxLength
    const isChangeAllowed = authSettings.isUserNicknameChangeAllowed
    const isNicknameChanging = currentNickname != null && currentNickname !== newNickname

    const validationResult = nicknameValidator.validate(
      newNickname,
      minLength,
      maxLength,
      isChangeAllowed,
      isNicknameChanging
    )

    if (validationResult !== null) {
      let error: AppError
      switch (validationResult) {
        case UserErrorCodes.NICKNAME_CHANGE_DISABLED:
          error = UserError.nicknameChangeDisabled()
          break
        case UserErrorCodes.NICKNAME_TOO_SHORT:
          error = UserError.nicknameTooShort(minLength)
          break
        case UserErrorCodes.NICKNAME_TOO_LONG:
          error = UserError.nicknameTooLong(maxLength)
          break
        case UserErrorCodes.INVALID_NICKNAME_CHARACTERS:
        default:
          error = UserError.invalidNicknameCharacters()
          break
      }
      return appResultFailure(error)
    }

    return appResultSuccess(undefined)
  }
}
