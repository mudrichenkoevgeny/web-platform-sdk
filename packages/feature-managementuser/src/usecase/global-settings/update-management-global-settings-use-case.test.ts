import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRepositoryMock } from '@/mock/repository/global-settings/management-global-settings-repository-mock'
import { UpdateManagementGlobalSettingsUseCase } from './update-management-global-settings-use-case'

describe('UpdateManagementGlobalSettingsUseCase', () => {
  it('delegates saving settings to repository on success', async () => {
    const repo = new ManagementGlobalSettingsRepositoryMock()
    const useCase = new UpdateManagementGlobalSettingsUseCase(repo)
    const newSettings = createTestManagementGlobalSettings()

    const result = await useCase.execute(newSettings)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(newSettings)
    }
  })

  it('returns failure when saving global settings fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementGlobalSettingsRepositoryMock()
    repo.saveResultProvider = async () => appResultFailure(expectedError)
    const useCase = new UpdateManagementGlobalSettingsUseCase(repo)
    const newSettings = createTestManagementGlobalSettings()

    const result = await useCase.execute(newSettings)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
