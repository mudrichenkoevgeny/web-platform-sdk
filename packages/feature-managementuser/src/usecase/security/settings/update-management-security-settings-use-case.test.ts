import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRepositoryMock } from '@/mock/repository/security/settings/management-security-settings-repository-mock'
import { UpdateManagementSecuritySettingsUseCase } from './update-management-security-settings-use-case'

describe('UpdateManagementSecuritySettingsUseCase', () => {
  it('delegates saving settings to repository on success', async () => {
    const repo = new ManagementSecuritySettingsRepositoryMock()
    const useCase = new UpdateManagementSecuritySettingsUseCase(repo)
    const newSettings = createTestManagementSecuritySettings()

    const result = await useCase.execute(newSettings)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(newSettings)
    }
  })

  it('returns failure when saving security settings fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementSecuritySettingsRepositoryMock()
    repo.saveResultProvider = async () => appResultFailure(expectedError)
    const useCase = new UpdateManagementSecuritySettingsUseCase(repo)
    const newSettings = createTestManagementSecuritySettings()

    const result = await useCase.execute(newSettings)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
