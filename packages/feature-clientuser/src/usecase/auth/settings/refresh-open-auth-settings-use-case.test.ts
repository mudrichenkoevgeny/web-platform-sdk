import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { createTestOpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { RefreshOpenAuthSettingsUseCase } from './refresh-open-auth-settings-use-case'

describe('RefreshOpenAuthSettingsUseCase', () => {
  it('delegates to openAuthSettingsRepository.refreshOpenAuthSettings on success', async () => {
    const repo = new OpenAuthSettingsRepositoryMock()
    const authSettings = createTestOpenAuthSettings()
    repo.emit(authSettings)
    const useCase = new RefreshOpenAuthSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(authSettings)
    }
  })

  it('returns failure when openAuthSettingsRepository refresh fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new OpenAuthSettingsRepositoryMock()
    repo.resultProvider = async () => appResultFailure(expectedError)
    const useCase = new RefreshOpenAuthSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
