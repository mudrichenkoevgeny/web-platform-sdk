import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '@/repository/open/open-storage-settings-repository'
import { GetOpenStorageSettingsUseCase } from './get-open-storage-settings-use-case'

describe('GetOpenStorageSettingsUseCase', () => {
  let repository: OpenStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateOpenStorageSettings: vi.fn(),
      observeOpenStorageSettings: vi.fn()
    }
  })

  it('delegates getSettings to repository and returns open storage settings', async () => {
    const expectedSettings = createTestOpenStorageSettings()
    vi.mocked(repository.getSettings).mockResolvedValue(appResultSuccess(expectedSettings))
    const useCase = new GetOpenStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
    expect(repository.getSettings).toHaveBeenCalledOnce()
  })

  it('returns failure when getSettings fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.getSettings).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new GetOpenStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
