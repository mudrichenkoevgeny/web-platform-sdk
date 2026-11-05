import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/management/management-storage-settings-repository'
import { GetManagementStorageSettingsUseCase } from './get-management-storage-settings-use-case'

describe('GetManagementStorageSettingsUseCase', () => {
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

  it('delegates getSettings to repository and returns settings payload', async () => {
    const expectedSettings = createTestManagementStorageSettings()
    vi.mocked(repository.getSettings).mockResolvedValue(appResultSuccess(expectedSettings))
    const useCase = new GetManagementStorageSettingsUseCase(repository)

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
    const useCase = new GetManagementStorageSettingsUseCase(repository)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
