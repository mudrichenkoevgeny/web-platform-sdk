import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/management/management-storage-settings-repository'
import { ResetManagementStorageSettingsUseCase } from './reset-management-storage-settings-use-case'

describe('ResetManagementStorageSettingsUseCase', () => {
  let repository: ManagementStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      observeSettings: vi.fn()
    }
  })

  it('delegates resetSettings to repository and returns default settings payload', async () => {
    const expectedSettings = createTestManagementStorageSettings()
    vi.mocked(repository.resetSettings).mockResolvedValue(appResultSuccess(expectedSettings))
    const useCase = new ResetManagementStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedSettings)
    }
    expect(repository.resetSettings).toHaveBeenCalledOnce()
  })

  it('returns failure when resetSettings fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.resetSettings).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new ResetManagementStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
