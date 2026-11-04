import { describe, it, expect, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserErrorCodes, createTestOpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ValidateNicknameUseCase } from './validate-nickname-use-case'
import { GetAuthSettingsUseCaseMock } from '@/mock/usecase/auth/settings/get-auth-settings-use-case-mock'

describe('ValidateNicknameUseCase', () => {
  let getAuthSettingsUseCase: GetAuthSettingsUseCaseMock
  let useCase: ValidateNicknameUseCase

  beforeEach(() => {
    getAuthSettingsUseCase = new GetAuthSettingsUseCaseMock()
    useCase = new ValidateNicknameUseCase(getAuthSettingsUseCase)
  })

  it('fails if getting auth settings fails', async () => {
    getAuthSettingsUseCase.resultProvider = async () => appResultFailure(CommonError.unknown())

    const result = await useCase.execute('newNick')

    expect(result.success).toBe(false)
  })

  it('fails with NICKNAME_CHANGE_DISABLED if change is not allowed', async () => {
    const settings = createTestOpenAuthSettings({ isUserNicknameChangeAllowed: false })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('newNick', 'oldNick')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.NICKNAME_CHANGE_DISABLED)
    }
  })

  it('fails with NICKNAME_TOO_SHORT if nickname is shorter than minLength', async () => {
    const settings = createTestOpenAuthSettings({ userNicknameMinLength: 5 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('abc')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.NICKNAME_TOO_SHORT)
    }
  })

  it('fails with NICKNAME_TOO_LONG if nickname is longer than maxLength', async () => {
    const settings = createTestOpenAuthSettings({ userNicknameMaxLength: 5 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('abcdefgh')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.NICKNAME_TOO_LONG)
    }
  })

  it('fails with INVALID_NICKNAME_CHARACTERS if nickname contains invalid characters', async () => {
    const settings = createTestOpenAuthSettings({ userNicknameMinLength: 1, userNicknameMaxLength: 10 })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('nick name!')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(UserErrorCodes.INVALID_NICKNAME_CHARACTERS)
    }
  })

  it('returns success if nickname is valid and passes all checks', async () => {
    const settings = createTestOpenAuthSettings({
      userNicknameMinLength: 3,
      userNicknameMaxLength: 10,
      isUserNicknameChangeAllowed: true
    })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('validNick', 'oldNick')

    expect(result.success).toBe(true)
  })

  it('returns success if nickname is not changed, even if change is disallowed', async () => {
    const settings = createTestOpenAuthSettings({
      userNicknameMinLength: 3,
      userNicknameMaxLength: 10,
      isUserNicknameChangeAllowed: false
    })
    getAuthSettingsUseCase.resultProvider = async () => appResultSuccess(settings)

    const result = await useCase.execute('sameNick', 'sameNick')

    expect(result.success).toBe(true)
  })
})
