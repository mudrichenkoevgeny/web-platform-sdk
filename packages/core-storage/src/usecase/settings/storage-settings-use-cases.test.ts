import { describe, it, expect, vi } from 'vitest'
import { GetOpenStorageSettingsUseCase } from './get-open-storage-settings-use-case'
import { RefreshOpenStorageSettingsUseCase } from './refresh-open-storage-settings-use-case'
import { OpenStorageSettingsRepositoryMock } from '@/mock/repository/open-storage-settings-repository-mock'

describe('Storage Settings Use Cases', () => {
  it('GetOpenStorageSettingsUseCase delegates to repository', async () => {
    const mockRepo = new OpenStorageSettingsRepositoryMock()
    vi.spyOn(mockRepo, 'getOpenStorageSettings')
    const useCase = new GetOpenStorageSettingsUseCase(mockRepo)

    await useCase.execute()
    expect(mockRepo.getOpenStorageSettings).toHaveBeenCalledTimes(1)
  })

  it('RefreshOpenStorageSettingsUseCase delegates to repository', async () => {
    const mockRepo = new OpenStorageSettingsRepositoryMock()
    vi.spyOn(mockRepo, 'refreshOpenStorageSettings')
    const useCase = new RefreshOpenStorageSettingsUseCase(mockRepo)

    await useCase.execute()
    expect(mockRepo.refreshOpenStorageSettings).toHaveBeenCalledTimes(1)
  })
})
