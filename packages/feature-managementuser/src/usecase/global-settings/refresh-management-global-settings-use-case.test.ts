import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRepositoryMock } from '@/mock/repository/global-settings/management-global-settings-repository-mock'
import { RefreshManagementGlobalSettingsUseCase } from './refresh-management-global-settings-use-case'

describe('RefreshManagementGlobalSettingsUseCase', () => {
  it('delegates to global settings repository refresh on success', async () => {
    const expectedSettings = createTestManagementGlobalSettings()
    const repo = new ManagementGlobalSettingsRepositoryMock(expectedSettings)
    const useCase = new RefreshManagementGlobalSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
  })

  it('returns failure when global settings refresh fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementGlobalSettingsRepositoryMock()
    repo.resultProvider = async () => appResultFailure(expectedError)
    const useCase = new RefreshManagementGlobalSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
