import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '@/repository/open/open-storage-settings-repository'
import { RefreshOpenStorageSettingsUseCase } from './refresh-open-storage-settings-use-case'

describe('RefreshOpenStorageSettingsUseCase', () => {
  let repository: OpenStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateOpenStorageSettings: vi.fn(),
      observeOpenStorageSettings: vi.fn()
    }
  })

  it('delegates refreshSettings to repository and returns settings payload', async () => {
    const expectedSettings = createTestOpenStorageSettings()
    vi.mocked(repository.refreshSettings).mockResolvedValue(appResultSuccess(expectedSettings))
    const useCase = new RefreshOpenStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
    expect(repository.refreshSettings).toHaveBeenCalledOnce()
  })

  it('returns failure when refreshSettings fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.refreshSettings).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new RefreshOpenStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
