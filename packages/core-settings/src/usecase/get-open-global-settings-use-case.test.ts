import { describe, it, expect } from 'vitest'
import { CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { GetOpenGlobalSettingsUseCase } from '@/usecase/get-open-global-settings-use-case'
import { OpenGlobalSettingsRepositoryMock } from '@/mock/repository/open-global-settings-repository-mock'

describe('GetOpenGlobalSettingsUseCase', () => {
  it('delegates to repository get method and returns settings payload on success', async () => {
    const expectedSettings = createTestOpenGlobalSettings()
    const repo = new OpenGlobalSettingsRepositoryMock({ initialSettings: expectedSettings })
    const useCase = new GetOpenGlobalSettingsUseCase(repo)

    expect(repo.getCallCount).toBe(0)
    const result = await useCase.execute()

    expect(repo.getCallCount).toBe(1)
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
  })

  it('returns failure when repository get method fails', async () => {
    const expectedError = CommonError.unknown()
    const repo = new OpenGlobalSettingsRepositoryMock({ shouldFailGet: true })
    const useCase = new GetOpenGlobalSettingsUseCase(repo)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toBe(expectedError.code)
    }
  })
})
