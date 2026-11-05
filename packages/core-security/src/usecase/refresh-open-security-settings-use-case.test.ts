import { describe, it, expect } from 'vitest'
import { CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenSecuritySettingsPayload, toOpenSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { RefreshOpenSecuritySettingsUseCase } from '@/usecase/refresh-open-security-settings-use-case'
import { OpenSecuritySettingsRepositoryMock } from '@/mock/repository/open-security-settings-repository-mock'

describe('RefreshOpenSecuritySettingsUseCase', () => {
  it('delegates to repository refresh method and returns settings payload on success', async () => {
    const expectedSettings = toOpenSecuritySettings(createTestOpenSecuritySettingsPayload())
    const repo = new OpenSecuritySettingsRepositoryMock({ initialSettings: expectedSettings })
    const useCase = new RefreshOpenSecuritySettingsUseCase(repo)

    expect(repo.refreshCallCount).toBe(0)
    const result = await useCase.execute()

    expect(repo.refreshCallCount).toBe(1)
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
  })

  it('returns failure when repository refresh fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new OpenSecuritySettingsRepositoryMock({ shouldFailGet: true })
    const useCase = new RefreshOpenSecuritySettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(expectedError.code)
    }
  })
})
