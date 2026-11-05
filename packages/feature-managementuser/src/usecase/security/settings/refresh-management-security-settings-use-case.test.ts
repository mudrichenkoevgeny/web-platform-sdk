import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRepositoryMock } from '@/mock/repository/security/settings/management-security-settings-repository-mock'
import { RefreshManagementSecuritySettingsUseCase } from './refresh-management-security-settings-use-case'

describe('RefreshManagementSecuritySettingsUseCase', () => {
  it('delegates to security settings repository refresh on success', async () => {
    const expectedSettings = createTestManagementSecuritySettings()
    const repo = new ManagementSecuritySettingsRepositoryMock(expectedSettings)
    const useCase = new RefreshManagementSecuritySettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
  })

  it('returns failure when security settings refresh fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementSecuritySettingsRepositoryMock()
    repo.resultProvider = async () => appResultFailure(expectedError)
    const useCase = new RefreshManagementSecuritySettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
