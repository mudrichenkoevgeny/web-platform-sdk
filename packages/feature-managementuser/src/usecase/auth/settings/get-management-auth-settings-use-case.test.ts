import { describe, it, expect } from 'vitest'
import { appResultFailure, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/management-auth-settings-repository-mock'
import { GetManagementAuthSettingsUseCase } from './get-management-auth-settings-use-case'

describe('GetManagementAuthSettingsUseCase', () => {
  it('delegates to auth settings repository and returns settings payload on success', async () => {
    const expectedSettings = createTestManagementAuthSettings()
    const repo = new ManagementAuthSettingsRepositoryMock()
    repo.emit(expectedSettings)
    const useCase = new GetManagementAuthSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
  })

  it('returns failure when auth settings repository fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new ManagementAuthSettingsRepositoryMock()
    repo.resultProvider = async () => appResultFailure(expectedError)
    const useCase = new GetManagementAuthSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
