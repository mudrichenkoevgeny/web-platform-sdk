import { describe, it, expect } from 'vitest'
import { GetOpenStorageSettingsUseCase } from './get-open-storage-settings-use-case'
import { RefreshOpenStorageSettingsUseCase } from './refresh-open-storage-settings-use-case'
import { OpenStorageSettingsRepositoryMock } from '@/mock'

describe('Open Storage Settings Use Cases', () => {
  it('GetOpenStorageSettingsUseCase delegates to repository', async () => {
    const repo = new OpenStorageSettingsRepositoryMock()
    const useCase = new GetOpenStorageSettingsUseCase(repo)

    const getSettingsResult = await useCase.execute()
    expect(getSettingsResult.success).toBe(true)
    expect(repo.getOpenStorageSettingsCallCount).toBe(1)
  })

  it('RefreshOpenStorageSettingsUseCase delegates to repository', async () => {
    const repo = new OpenStorageSettingsRepositoryMock()
    const useCase = new RefreshOpenStorageSettingsUseCase(repo)

    const refreshSettingsResult = await useCase.execute()
    expect(refreshSettingsResult.success).toBe(true)
    expect(repo.refreshOpenStorageSettingsCallCount).toBe(1)
  })
})
