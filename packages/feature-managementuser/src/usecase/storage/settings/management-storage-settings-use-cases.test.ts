import { describe, it, expect, vi } from 'vitest'
import { createTestManagementStorageSettingsPayload, toManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { GetManagementStorageSettingsUseCase } from './get-management-storage-settings-use-case'
import { SaveManagementStorageSettingsUseCase } from './save-management-storage-settings-use-case'
import { ResetManagementStorageSettingsUseCase } from './reset-management-storage-settings-use-case'
import { ObserveManagementStorageSettingsUseCase } from './observe-management-storage-settings-use-case'
import { ManagementStorageSettingsRepositoryMock } from '@/mock/repository/storage/settings/management-storage-settings-repository-mock'

describe('Management Storage Settings Use Cases', () => {
  const sampleSettings = toManagementStorageSettings(createTestManagementStorageSettingsPayload())

  it('GetManagementStorageSettingsUseCase delegates to repository', async () => {
    const repo = new ManagementStorageSettingsRepositoryMock({ initialSettings: sampleSettings })
    const useCase = new GetManagementStorageSettingsUseCase(repo)

    const result = await useCase.execute()
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(sampleSettings)
    }
  })

  it('SaveManagementStorageSettingsUseCase delegates to repository', async () => {
    const repo = new ManagementStorageSettingsRepositoryMock()
    const useCase = new SaveManagementStorageSettingsUseCase(repo)

    const result = await useCase.execute(sampleSettings)
    expect(result.success).toBe(true)
  })

  it('ResetManagementStorageSettingsUseCase delegates to repository', async () => {
    const repo = new ManagementStorageSettingsRepositoryMock()
    const useCase = new ResetManagementStorageSettingsUseCase(repo)

    const result = await useCase.execute()
    expect(result.success).toBe(true)
  })

  it('ObserveManagementStorageSettingsUseCase delegates to repository', () => {
    const repo = new ManagementStorageSettingsRepositoryMock({ initialSettings: sampleSettings })
    const useCase = new ObserveManagementStorageSettingsUseCase(repo)

    const listener = vi.fn()
    const unsubscribe = useCase.execute(listener)

    expect(listener).toHaveBeenCalledWith(sampleSettings)
    unsubscribe()
  })
})
