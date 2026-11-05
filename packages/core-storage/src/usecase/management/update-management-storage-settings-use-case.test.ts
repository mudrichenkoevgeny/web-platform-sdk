import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/management/management-storage-settings-repository'
import { UpdateManagementStorageSettingsUseCase } from './update-management-storage-settings-use-case'

describe('UpdateManagementStorageSettingsUseCase', () => {
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

  it('delegates updateSettings to repository with new settings', async () => {
    const updatedSettings = createTestManagementStorageSettings()
    vi.mocked(repository.updateSettings).mockResolvedValue(appResultSuccess(updatedSettings))
    const useCase = new UpdateManagementStorageSettingsUseCase(repository)

    const result = await useCase.execute(updatedSettings)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(updatedSettings)
    }
    expect(repository.updateSettings).toHaveBeenCalledWith(updatedSettings)
  })

  it('returns failure when updateSettings fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.updateSettings).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new UpdateManagementStorageSettingsUseCase(repository)
    const settings = createTestManagementStorageSettings()

    const result = await useCase.execute(settings)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})
