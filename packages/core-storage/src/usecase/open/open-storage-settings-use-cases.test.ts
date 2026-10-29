import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenStorageSettingsRepository } from '../../repository/open/open-storage-settings-repository'
import { GetOpenStorageSettingsUseCase } from './get-open-storage-settings-use-case'
import { RefreshOpenStorageSettingsUseCase } from './refresh-open-storage-settings-use-case'
import { ObserveOpenStorageSettingsUseCase } from './observe-open-storage-settings-use-case'

describe('Open Storage Settings UseCases', () => {
  let repository: OpenStorageSettingsRepository

  beforeEach(() => {
    repository = {
      getSettings: vi.fn(),
      refreshSettings: vi.fn(),
      updateOpenStorageSettings: vi.fn(),
      observeOpenStorageSettings: vi.fn()
    }
  })

  it('delegates GetOpenStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.getSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new GetOpenStorageSettingsUseCase(repository)
    await useCase.execute()
    expect(repository.getSettings).toHaveBeenCalled()
  })

  it('delegates RefreshOpenStorageSettingsUseCase to repository', async () => {
    vi.mocked(repository.refreshSettings).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new RefreshOpenStorageSettingsUseCase(repository)
    await useCase.execute()
    expect(repository.refreshSettings).toHaveBeenCalled()
  })

  it('delegates ObserveOpenStorageSettingsUseCase to repository', () => {
    const observer = vi.fn()
    const useCase = new ObserveOpenStorageSettingsUseCase(repository)
    useCase.execute(observer)
    expect(repository.observeOpenStorageSettings).toHaveBeenCalledWith(observer)
  })
})
