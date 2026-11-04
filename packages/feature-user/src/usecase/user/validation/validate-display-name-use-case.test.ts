import { describe, it, expect, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserErrorCodes, createTestOpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ValidateDisplayNameUseCase } from './validate-display-name-use-case'
import { GetAuthSettingsUseCaseMock } from '@/mock/usecase/auth/settings/get-auth-settings-use-case-mock'

describe('ValidateDisplayNameUseCase', () => {
  let getAuthSettingsUseCase: GetAuthSettingsUseCaseMock
  let useCase: ValidateDisplayNameUseCase

  beforeEach(() => {
    getAuthSettingsUseCase = new GetAuthSettingsUseCaseMock()
    useCase = new ValidateDisplayNameUseCase(getAuthSettingsUseCase)
  })

  it('fails if getting auth settings fails', async () => {
    getAuthSettingsUseCase.resultProvider = async () => appResultFailure(CommonError.unknown())

    const result = await useCase.execute('John Doe')

    expect(result.success).toBe(false)
  })

  it('fails with DISPLAY_NAME_TOO_SHORT if display name is shorter than minLength', async () => {
    const settings = createTestOpenAuthSettings({ userDisplayNameMinLength: 5 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('John')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.DISPLAY_NAME_TOO_SHORT)
    }
  })

  it('fails with DISPLAY_NAME_TOO_LONG if display name is longer than maxLength', async () => {
    const settings = createTestOpenAuthSettings({ userDisplayNameMaxLength: 5 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('John Doe')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.DISPLAY_NAME_TOO_LONG)
    }
  })

  it('fails with INVALID_DISPLAY_NAME_CHARACTERS if display name contains invalid characters', async () => {
    const settings = createTestOpenAuthSettings({ userDisplayNameMinLength: 1, userDisplayNameMaxLength: 50 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    // Using a multiline string to trigger invalid characters (unlike '@' which might be allowed)
    const result = await useCase.execute('John\nDoe')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.INVALID_DISPLAY_NAME_CHARACTERS)
    }
  })

  it('returns success if display name is valid and passes all checks', async () => {
    const settings = createTestOpenAuthSettings({
      userDisplayNameMinLength: 3,
      userDisplayNameMaxLength: 50
    })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('John Doe')

    expect(result.success).toBe(true)
  })
})
