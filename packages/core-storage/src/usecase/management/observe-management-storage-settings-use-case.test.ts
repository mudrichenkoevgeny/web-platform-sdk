import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageSettingsRepository } from '@/repository/management/management-storage-settings-repository'
import { ObserveManagementStorageSettingsUseCase } from './observe-management-storage-settings-use-case'

describe('ObserveManagementStorageSettingsUseCase', () => {
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

  it('delegates observeSettings to repository and passes updates to observer', () => {
    const observer = vi.fn()
    const useCase = new ObserveManagementStorageSettingsUseCase(repository)
    useCase.execute(observer)

    expect(repository.observeSettings).toHaveBeenCalledWith(observer)

    const settings = createTestManagementStorageSettings()
    const observerCall = vi.mocked(repository.observeSettings).mock.calls[0]?.[0]
    if (observerCall) {
      observerCall(settings)
      expect(observer).toHaveBeenCalledWith(settings)
    }
  })
})
