import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestOpenStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageSettingsRepository } from '@/repository/open/open-storage-settings-repository'
import { ObserveOpenStorageSettingsUseCase } from './observe-open-storage-settings-use-case'

describe('ObserveOpenStorageSettingsUseCase', () => {
  let repository: OpenStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateOpenStorageSettings: vi.fn(),
      observeOpenStorageSettings: vi.fn()
    }
  })

  it('delegates observeOpenStorageSettings to repository and forwards updates', () => {
    const observer = vi.fn()
    const useCase = new ObserveOpenStorageSettingsUseCase(repository)
    useCase.execute(observer)

    expect(repository.observeOpenStorageSettings).toHaveBeenCalledWith(observer)

    const settings = createTestOpenStorageSettings()
    const observerCall = vi.mocked(repository.observeOpenStorageSettings).mock.calls[0]?.[0]
    if (observerCall) {
      observerCall(settings)
      expect(observer).toHaveBeenCalledWith(settings)
    }
  })
})
