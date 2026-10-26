import { describe, it, expect } from 'vitest'
import { createTestManagementStorageSettingsPayload, toManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { GetManagementStorageSettingsUseCase } from './get-management-storage-settings-use-case'
import { UpdateManagementStorageSettingsUseCase } from './update-management-storage-settings-use-case'
import { ResetManagementStorageSettingsUseCase } from './reset-management-storage-settings-use-case'
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

  it('UpdateManagementStorageSettingsUseCase delegates to repository', async () => {
    const repo = new ManagementStorageSettingsRepositoryMock()
    const useCase = new UpdateManagementStorageSettingsUseCase(repo)

    const result = await useCase.execute(sampleSettings)
    expect(result.success).toBe(true)
  })

  it('ResetManagementStorageSettingsUseCase delegates to repository', async () => {
    const repo = new ManagementStorageSettingsRepositoryMock()
    const useCase = new ResetManagementStorageSettingsUseCase(repo)

    const result = await useCase.execute()
    expect(result.success).toBe(true)
  })
})
